// ==UserScript==
// @name         LabTrack Controller
// @namespace    http://tampermonkey.net/
// @version      7.15
// @description  Enhanced Labouchere strategy tracker for Torn.com Roulette with auto-detect, drag & drop, and advanced safety features
// @author       Nimo313 (Enhanced by Claude AI)
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @license      MIT
// @homepage     https://greasyfork.org/de/scripts/561167-labtrack-controller-v7-00-enhanced-performance-modern-es6
// @supportURL   https://greasyfork.org/de/scripts/561167-labtrack-controller-v7-00-enhanced-performance-modern-es6/feedback
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561167/LabTrack%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/561167/LabTrack%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple instances
    if (window.LabTrackRunning) return;
    window.LabTrackRunning = true;

    // =============================================================================
    // CONFIGURATION CONSTANTS - V7.00 Enhancement
    // =============================================================================
    const CONFIG = Object.freeze({
        VERSION: '7.15',
        RACE_LOCK_MS: 3000,              // Race condition protection
        DOM_DELAY_MS: 50,                 // DOM spy delay
        POLL_MS: 500,                     // Polling interval
        HOSPITAL_LOCK_MS: 2500,           // Hospital overlay lock duration
        TOAST_MS: 2000,                   // Toast notification duration
        MANUAL_BET_TIMEOUT_MS: 30000,     // Manual bet tracking timeout
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
    // LOGGER UTILITY - V7.00 Enhancement
    // =============================================================================
    class Logger {
        static LEVELS = Object.freeze({ DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 });
        static currentLevel = Logger.LEVELS.INFO;

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

            // Also log to devTool if available
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
    // VALIDATOR UTILITY - V7.00 Enhancement
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
    // PERFORMANCE UTILITIES - V7.00 Enhancement
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
                setTimeout(fn, 16); // ~60fps fallback
            }
        }
    }

    // =============================================================================
    // DOM CACHE - V7.00 Enhancement
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
    // EVENT LISTENER MANAGER - V7.00 Enhancement
    // =============================================================================
    class EventManager {
        constructor() {
            this.listeners = new Map();
        }

        add(element, event, handler, id) {
            const key = id || `${element.id || 'unknown'}-${event}-${Date.now()}`;

            // Remove existing listener if present
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

    // --- TORNPDA / MOBILE CSS INJECTOR (Native) ---
    function addCustomStyle(css) {
        const style = document.createElement('style');
        style.id = 'lt-custom-styles';
        style.textContent = css;
        (document.head || document.documentElement).appendChild(style);
    }

    // --- CSS STYLES ---
    addCustomStyle(`
        #lt-dashboard {
            position: relative; width: 100%; margin-bottom: 20px;
            background: #181818; border: 1px solid #7c3aed; border-radius: 8px;
            color: #e2e8f0; font-family: 'Segoe UI', Tahoma, sans-serif;
            z-index: 10;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            display: none; flex-direction: column; font-size: 13px; box-sizing: border-box;
        }
        #lt-dashboard.visible { display: flex; }

        #lt-dashboard.flash-win { border-color: #4ade80; box-shadow: 0 0 20px rgba(74, 222, 128, 0.2); }
        #lt-dashboard.flash-loss { border-color: #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); }

        /* Hospital Overlay */
        #lt-hospital-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(220, 20, 60, 0.25);
            pointer-events: none;
            z-index: 999990;
            display: none !important;
            mix-blend-mode: multiply;
            transition: opacity 0.1s ease;
        }
        #lt-hospital-overlay.visible { display: block !important; }

        /* Full Screen Flash Overlay */
        #lt-flash-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            pointer-events: none; z-index: 999995; opacity: 0; transition: opacity 0.3s ease-out;
        }
        #lt-flash-overlay.win { background: rgba(74, 222, 128, 0.25); opacity: 1; }
        #lt-flash-overlay.loss { background: rgba(239, 68, 68, 0.25); opacity: 1; }

        #lt-header {
            padding: 8px 15px; background: rgba(139, 92, 246, 0.15); display: flex;
            justify-content: space-between; align-items: center; font-weight: bold;
            border-bottom: 1px solid #333; border-radius: 8px 8px 0 0; user-select: none;
        }
        #lt-content { padding: 15px; display: flex; flex-direction: column; gap: 12px; }
        .lt-grid-main { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; align-items: start; }
        .lt-btn {
            border: none; border-radius: 6px; padding: 10px 12px; cursor: pointer; font-weight: bold;
            transition: all 0.2s; font-size: 12px; color: white; display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
        }
        .lt-btn:hover { filter: brightness(1.2); transform: translateY(-1px); }
        .lt-btn:active { transform: translateY(0); }
        .lt-btn-primary { background: #7c3aed; }
        .lt-btn-win { background: rgba(34, 197, 94, 0.15); border: 1px solid #22c55e; color: #4ade80; }
        .lt-btn-loss { background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #f87171; }
        .lt-btn-action { background: #334155; color: #cbd5e1; border: 1px solid #475569; }
        .lt-btn-active { background: #f97316 !important; color: white !important; border-color: #ea580c !important; }
        .lt-btn-confirm { background: #15803d; color: white; border: 1px solid #22c55e; margin-top: 5px; }
        .lt-btn-play-again { background: #22c55e; color: white; font-size: 14px; padding: 15px; margin-top: 10px; box-shadow: 0 0 15px rgba(34, 197, 94, 0.4); }
        .lt-btn-new-random { background: #334155; color: #e2e8f0; font-size: 11px; padding: 8px; margin-top: 5px; border: 1px solid #475569; }
        .lt-btn-reset { background: #7f1d1d; color: #fecaca; font-size: 11px; padding: 8px; margin-top: 15px; border: 1px solid #ef4444; }
        .lt-btn-debug { background: #be123c; color: #fff; padding: 2px 6px; font-size: 10px; border-radius: 4px; border: 1px solid #f43f5e; cursor: pointer; }

        #lt-btn-auto { background: #334155; color: #cbd5e1; border: 1px solid #475569; }
        #lt-btn-auto.active { background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: #22c55e; }

        /* Stats Row */
        .lt-stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 11px; color: #94a3b8; margin-bottom: 5px; }
        .lt-stat-item { display: flex; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px; }
        .lt-stat-val { font-weight: bold; color: #e2e8f0; }

        .lt-bet-box {
            text-align:center; margin: 10px 0; padding:15px; background:rgba(0,0,0,0.2);
            border-radius:8px; border:1px solid rgba(255,255,255,0.05); cursor: pointer; transition: border-color 0.2s;
        }
        .lt-bet-box:hover { border-color: #7c3aed; }
        .lt-bet-box.override { border-color: #eab308; background: rgba(234, 179, 8, 0.05); }
        .lt-big-val { font-size: 32px; font-weight: 900; color: #fff; text-align: center; margin: 5px 0; text-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
        .lt-big-val.override { color: #eab308; text-shadow: 0 0 20px rgba(234, 179, 8, 0.3); }

        .lt-seq-container {
            display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; background: rgba(0,0,0,0.3);
            border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); min-height: 50px; justify-content: center; align-items: center;
        }
        .lt-badge {
            background: #1e293b; border: 1px solid rgba(255,255,255,0.1); padding: 6px 10px; border-radius: 6px;
            font-family: monospace; font-size: 13px; font-weight: bold; cursor: pointer; user-select: none; transition: all 0.1s;
        }
        .lt-badge:hover { background: #7c3aed; color: white; border-color: #8b5cf6; }
        .lt-badge.selected { background: #f97316; color: white; border-color: #ea580c; transform: scale(1.05); }
        .lt-badge.dragging { opacity: 0.4; border: 1px dashed #fff; }

        /* Drag Visuals */
        .lt-badge.drop-left { border-left: 3px solid #38bdf8; margin-left: -3px; }
        .lt-badge.drop-right { border-right: 3px solid #38bdf8; margin-right: -3px; }

        .lt-input-group { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; position: relative; }
        .lt-input { background: #0f172a; border: 1px solid #334155; color: white; padding: 8px; border-radius: 4px; width: 100%; font-size: 12px; transition: border-color 0.2s; }
        .lt-input.error { border-color: #ef4444; }
        .lt-label { font-size: 11px; color: #94a3b8; width: 70px; flex-shrink: 0; }
        .lt-input-preview { position: absolute; right: 10px; color: #4ade80; font-size: 10px; font-weight: bold; pointer-events: none; background: rgba(15, 23, 42, 0.9); padding-left: 5px; }

        /* Multiplier Buttons */
        .lt-mult-group { display: flex; gap: 4px; margin-bottom: 12px; justify-content: center; background: #0f172a; padding: 4px; border-radius: 6px; }
        .lt-mult-btn {
            flex: 1; background: #1e293b; border: 1px solid #334155; color: #94a3b8;
            padding: 4px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 4px; transition: all 0.2s;
        }
        .lt-mult-btn:hover { background: #334155; }
        .lt-mult-btn.active { background: #7c3aed; color: white; border-color: #8b5cf6; }

        .lt-checkbox-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12px; color: #cbd5e1; cursor: pointer; }
        .lt-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: #7c3aed; }
        .lt-hidden { display: none !important; }
        .lt-tabs { display: flex; gap: 4px; margin-bottom: 12px; background: #0f172a; padding: 3px; border-radius: 6px; }
        .lt-tab { flex: 1; text-align: center; padding: 6px; cursor: pointer; border-radius: 4px; font-size: 12px; color: #94a3b8; transition: all 0.2s; }
        .lt-tab.active { background: #7c3aed; color: white; font-weight: bold; }

        .lt-toast {
            position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.9); color: white; padding: 8px 16px; border-radius: 20px;
            font-size: 12px; font-weight: bold; pointer-events: none; opacity: 0; transition: opacity 0.3s;
            z-index: 1000000; border: 1px solid #7c3aed; white-space: nowrap;
        }
        .lt-toast.show { opacity: 1; }

        .lt-history-list { max-height: 200px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; }
        .lt-history-list::-webkit-scrollbar { width: 8px; }
        .lt-history-list::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .lt-history-list::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.5); border-radius: 4px; }
        .lt-history-list::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.7); }
        .lt-history-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 8px; border-radius: 4px; font-size: 12px; }
        .lt-history-win { border-left: 3px solid #4ade80; }
        .lt-history-loss { border-left: 3px solid #ef4444; }
        .lt-hist-badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
        .lt-hist-win-bg { background: rgba(74, 222, 128, 0.2); color: #4ade80; }
        .lt-hist-loss-bg { background: rgba(239, 68, 68, 0.2); color: #f87171; }
        .lt-status-bar { font-size: 10px; text-align: center; margin-bottom: 8px; color: #64748b; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }

        /* INFO PANEL & TOS - V7.00 Enhanced */
        .lt-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
        .lt-info-card { background: rgba(124, 58, 237, 0.08); border: 1px solid rgba(124, 58, 237, 0.2); border-radius: 8px; padding: 12px; transition: all 0.2s; }
        .lt-info-card:hover { background: rgba(124, 58, 237, 0.12); border-color: rgba(124, 58, 237, 0.4); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15); }
        .lt-info-head { font-weight: bold; color: #a78bfa; margin-bottom: 10px; font-size: 14px; border-bottom: 2px solid rgba(124, 58, 237, 0.3); padding-bottom: 6px; display: flex; align-items: center; gap: 8px; }
        .lt-info-list li { margin-bottom: 8px; color: #cbd5e1; list-style: none; position: relative; padding-left: 18px; line-height: 1.5; }
        .lt-info-list li::before { content: "▸"; color: #a78bfa; position: absolute; left: 0; font-weight: bold; font-size: 14px; }

        /* ToS Table - V7.00 Enhanced */
        .lt-tos-table { width: 100%; border-collapse: collapse; font-size: 11px; color: #ffffff; background: rgba(0,0,0,0.2); border-radius: 6px; overflow: hidden; }
        .lt-tos-table th { text-align: left; padding: 8px 10px; background: rgba(124, 58, 237, 0.15); color: #ffffff; font-weight: bold; border-bottom: 2px solid #7c3aed; }
        .lt-tos-table td { padding: 8px 10px; border-bottom: 1px solid rgba(124, 58, 237, 0.1); vertical-align: top; color: #e2e8f0; }
        .lt-tos-table td:first-child { color: #ffffff; font-weight: 600; width: 120px; }
        .lt-tos-table tr:hover { background: rgba(124, 58, 237, 0.08); }
        .lt-tos-table tr:last-child td { border-bottom: none; }

        /* Custom Scrollbars - V7.00 */
        #lt-info-panel::-webkit-scrollbar,
        #lt-debug-content-net::-webkit-scrollbar,
        #lt-gen-preview-seq::-webkit-scrollbar { width: 6px; }
        #lt-info-panel::-webkit-scrollbar-track,
        #lt-debug-content-net::-webkit-scrollbar-track,
        #lt-gen-preview-seq::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 4px; }
        #lt-info-panel::-webkit-scrollbar-thumb,
        #lt-debug-content-net::-webkit-scrollbar-thumb,
        #lt-gen-preview-seq::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.5); border-radius: 4px; }
        #lt-info-panel::-webkit-scrollbar-thumb:hover,
        #lt-debug-content-net::-webkit-scrollbar-thumb:hover,
        #lt-gen-preview-seq::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.7); }

        /* DEBUG TOOL STYLES */
        #lt-debug-panel {
            position: fixed; top: 50px; right: 20px; width: 450px; height: 500px;
            background: #0f172a; border: 2px solid #be123c; border-radius: 8px;
            display: none; flex-direction: column; z-index: 1000100;
            box-shadow: 0 10px 25px rgba(0,0,0,0.8); font-family: monospace;
        }
        #lt-debug-header {
            padding: 10px; background: #be123c; color: white; font-weight: bold; display: flex; justify-content: space-between; align-items: center;
        }
        #lt-debug-content-net {
            flex: 1; overflow-y: auto; padding: 10px; color: #a5f3fc; font-size: 11px; white-space: pre-wrap;
        }
        .lt-debug-entry { margin-bottom: 8px; border-bottom: 1px solid #334155; padding-bottom: 4px; word-break: break-all; }
        .lt-debug-time { color: #64748b; margin-right: 5px; }
        .lt-debug-tag { color: #facc15; font-weight: bold; margin-right: 5px; }
        .lt-spy-controls { padding: 10px; background: #1e293b; border-top: 1px solid #334155; display: flex; gap: 5px; }
        .lt-spy-input { flex: 1; background: #0f172a; border: 1px solid #475569; color: white; padding: 4px; border-radius: 4px; font-family: monospace; font-size: 11px; }
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

            // Balance sequence to match target
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

            // Final validation
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

    // --- DEV TOOLS CLASS ---
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
                <div id="lt-debug-header"><span>🐞 LabTrack Debug - Network Log</span><span id="lt-debug-close" style="cursor:pointer">X</span></div>
                <div id="lt-debug-content-net" class="active"></div>
                <div style="padding:5px;border-top:1px solid #333;"><button class="lt-btn lt-btn-action" id="lt-copy-log">Copy Log</button></div>
            `;
            document.body.appendChild(div);

            div.querySelector('#lt-debug-close').addEventListener('click', () => { div.style.display = 'none'; });

            document.getElementById('lt-copy-log').addEventListener('click', () => {
                const txt = this.netLogs.map(l => `[${l.time}] ${l.tag}: ${l.msg}`).join('\n');
                navigator.clipboard.writeText(txt);
                Utils.showToast('Network Log copied!');
            });
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
            // ASYNC SPY
            this.domObserver = new MutationObserver((mutations) => {
                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if(node.nodeType === 1) { // Element
                            // Async Check
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
            this.lastActionTime = 0; // V6.31: Hard lock for race conditions

            if (this.state.autoDetect === undefined) this.state.autoDetect = true;
            if (this.state.customBet === undefined) this.state.customBet = null;
            if (this.state.roundCount === undefined) this.state.roundCount = 0;
            if (this.state.roundHistory === undefined) this.state.roundHistory = [];
            if (this.state.initialSequence === undefined) this.state.initialSequence = [];
            if (this.state.multiplier === undefined) this.state.multiplier = 1; // Base internal multiplier

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
                const data = localStorage.getItem(CONFIG.STORAGE_SAVE);
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
                localStorage.setItem(CONFIG.STORAGE_SAVE, data);
                this.notify();
            } catch(e) {
                if (e.name === 'QuotaExceededError') {
                    Logger.error('GameEngine', 'Storage quota exceeded');
                    Utils.showToast("Storage full - clearing old data");
                    this.compactHistory();
                    try {
                        localStorage.setItem(CONFIG.STORAGE_SAVE, JSON.stringify(this.state));
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
            localStorage.removeItem('lt_standalone_save');
            localStorage.removeItem('lt_settings');
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

            // Calculate base bet from sequence
            const baseBet = this.getNextBaseBet();

            // Apply selected multiplier (default 1 if not set)
            let mult = 1;
            try {
                const s = JSON.parse(localStorage.getItem('lt_settings'));
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

        // V6.29: Helper for raw sequence value
        getNextBaseBet() {
            const seq = this.state.sequence;
            if(seq.length===0) return 0;
            if(seq.length===1) return seq[0].value;
            return seq[0].value + seq[seq.length-1].value;
        }

        // V7.09: Bulletproof deduplication using set-first-check-after
        processWin() {
            const now = Date.now();

            // V7.09 FIX: SET marker FIRST, then check previous value
            // This is the ONLY way to prevent TOCTOU
            const prevMarker = this._winProcessingTime;
            this._winProcessingTime = now;  // SET IMMEDIATELY

            // Now check: was there already a recent call?
            if (prevMarker && (now - prevMarker) < 3000) {
                Logger.warn('GameEngine', 'Win SKIPPED - duplicate call within 3s');
                return;
            }

            const bet = this.pendingBet || this.getEffectiveBet();

            // Also check history as backup
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
                const settings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_SETTINGS));
                mult = parseFloat(settings?.multVal) || 1;
            } catch(e) {
                Logger.debug('GameEngine', 'Using default multiplier');
            }

            const baseProfit = bet / mult;

            this.state.roundHistory.unshift({
                result: 'WIN',
                bet,
                profit: bet,
                time: now  // Use the same 'now' timestamp
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

            // V7.03: Clear customBet after use (one-time use only)
            if (this.state.customBet) {
                Logger.info('CustomBet', `Clearing after use: ${Utils.formatNumber(this.state.customBet)}`);
                this.state.customBet = null;
            }

            this.saveState();
            Logger.info('GameEngine', `Win processed: ${Utils.formatNumber(bet)}`);
        }

        processLoss(amount) {
            const now = Date.now();

            // V7.09 FIX: SET marker FIRST, then check previous value
            const prevMarker = this._lossProcessingTime;
            this._lossProcessingTime = now;  // SET IMMEDIATELY

            if (prevMarker && (now - prevMarker) < 3000) {
                Logger.warn('GameEngine', 'Loss SKIPPED - duplicate call within 3s');
                return;
            }

            const bet = amount || this.pendingBet || this.getEffectiveBet();

            // Also check history as backup
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
                const settings = JSON.parse(localStorage.getItem(CONFIG.STORAGE_SETTINGS));
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

            // V7.03: Clear customBet after use (one-time use only)
            if (this.state.customBet) {
                Logger.info('CustomBet', `Clearing after use: ${Utils.formatNumber(this.state.customBet)}`);
                this.state.customBet = null;
            }

            this.saveState();
            Logger.info('GameEngine', `Loss processed: ${Utils.formatNumber(bet)}`);
        }
        shuffleSequence() { this.pushHistory(); this.state.sequence.sort(() => Math.random() - 0.5); this.saveState(); Utils.showToast("Shuffled"); }

        // DRAG & DROP LOGIC
        reorderSequence(fromIdx, toIdx) {
            if(fromIdx === toIdx) return;
            let adjust = 0;
            if (fromIdx < toIdx) adjust = -1;
            const finalTo = toIdx + adjust;
            if (finalTo < 0 || finalTo > this.state.sequence.length) return;
            this.pushHistory();
            const item = this.state.sequence.splice(fromIdx, 1)[0];
            this.state.sequence.splice(finalTo, 0, item);
            this.saveState();
            Utils.showToast("Reordered");
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

    // --- UI MANAGER ---
    class OverlayUI {
        constructor() {
            this.mergeMode = false; this.selectedForMerge = [];
            this.dragSrcIndex = null;
            let s; try{ s=JSON.parse(localStorage.getItem('lt_settings')); }catch(e){}
            // V6.29: Added multKey ('1x','k','m','b') and multVal (numeric)
            this.savedSettings = s || { mode:'bankroll', bankroll:'', risk:'5', target:'', parts:'10', integers:false, uniform:false, multKey:'1x', multVal:1 };
            if(!this.savedSettings.multKey) { this.savedSettings.multKey='1x'; this.savedSettings.multVal=1; }
            this.genMode = this.savedSettings.mode || 'bankroll';
        }
        saveSettingsFromUI() {
            ['bankroll','risk','target','parts'].forEach(k => { const el=document.getElementById('lt-inp-'+k); if(el) this.savedSettings[k]=el.value; });
            ['integers','uniform'].forEach(k => { const el=document.getElementById('lt-chk-'+k); if(el) this.savedSettings[k]=el.checked; });
            this.savedSettings.mode = this.genMode;
            localStorage.setItem('lt_settings', JSON.stringify(this.savedSettings));
            this.updateInputPreviews();
        }
        setMultiplier(key) {
            this.savedSettings.multKey = key;
            if(key === 'k') this.savedSettings.multVal = 1000;
            else if(key === 'm') this.savedSettings.multVal = 1000000;
            else if(key === 'b') this.savedSettings.multVal = 1000000000;
            else this.savedSettings.multVal = 1;

            // Update UI buttons
            ['1x','k','m','b'].forEach(k => {
                const btn = document.getElementById('lt-btn-mult-'+k);
                if(btn) {
                    if(k===key) btn.classList.add('active');
                    else btn.classList.remove('active');
                }
            });
            this.saveSettingsFromUI();
            this.update(); // Refresh display numbers
        }
        updateInputPreviews() {
            const mult = this.savedSettings.multVal || 1;
            const suffix = this.savedSettings.multKey !== '1x' ? this.savedSettings.multKey.toUpperCase() : '';

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

            // HOSPITAL OVERLAY MOUNT
            if(!document.getElementById('lt-hospital-overlay')) {
                const ov = document.createElement('div');
                ov.id = 'lt-hospital-overlay';
                document.body.appendChild(ov);
            }
            // FLASH OVERLAY MOUNT
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
                void el.offsetWidth; // Force Reflow
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
                    <span id="lt-btn-debug" class="lt-btn lt-btn-debug">🐞</span>
                    <button id="lt-btn-info" class="lt-btn lt-btn-action" style="padding:4px 8px;width:auto;">ℹ️ Info</button>
                    <span id="lt-toggle-ui" style="cursor:pointer;padding:4px 8px;background:rgba(0,0,0,0.2);border-radius:4px;">_</span>
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
                    <div id="lt-bet-box" class="lt-bet-box"><div style="font-size:10px;color:#64748b;text-transform:uppercase;margin-bottom:5px;">Next Bet</div><div id="lt-bet-display" class="lt-big-val">0</div></div>
                    <div style="display:flex;gap:8px;margin-bottom:8px;"><button id="lt-btn-win" class="lt-btn lt-btn-win">WIN</button><button id="lt-btn-loss" class="lt-btn lt-btn-loss">LOSS</button></div>
                    <div style="display:flex;gap:8px;"><button id="lt-btn-auto" class="lt-btn">Auto: ON</button><button id="lt-btn-reset-bet" class="lt-btn lt-btn-action">🔄 Reset Bet</button></div>
                </div><div style="display:flex;flex-direction:column;gap:8px;height:100%;">
                    <div style="display:flex;gap:8px;">
                        <button id="lt-btn-gen-show" class="lt-btn lt-btn-action">Setup</button><button id="lt-btn-show-history" class="lt-btn lt-btn-action">History</button><button id="lt-btn-undo" class="lt-btn lt-btn-action">↩ Last Round</button>
                    </div>
                    <div style="display:flex;gap:8px;"><button id="lt-btn-shuffle" class="lt-btn lt-btn-action">Shuffle</button><button id="lt-btn-merge" class="lt-btn lt-btn-action">Merge</button></div>
                    <div id="lt-sequence" class="lt-seq-container" style="flex:1;"></div>
                    <div id="lt-play-again-container" style="display:none;flex:1;flex-direction:column;justify-content:center;">
                        <div class="lt-finished-msg">Sequence Complete!</div>
                        <button id="lt-btn-play-again" class="lt-btn lt-btn-play-again">🔄 Play Again (Same)</button>
                        <button id="lt-btn-new-random" class="lt-btn lt-btn-new-random">🎲 New Random</button>
                    </div>
                    <button id="lt-btn-confirm-merge" class="lt-btn lt-btn-confirm lt-hidden">✓ Confirm Merge</button>
                </div></div>

                <div id="lt-gen-panel" class="lt-hidden" style="background:#0f172a;padding:15px;border-radius:8px;border:1px solid #334155;margin-top:10px;">
                    <div class="lt-tabs"><div class="lt-tab active" id="lt-tab-bankroll">Bankroll</div><div class="lt-tab" id="lt-tab-target">Target</div></div>

                    <div class="lt-mult-group">
                        <div id="lt-btn-mult-1x" class="lt-mult-btn ${this.savedSettings.multKey==='1x'?'active':''}">1x</div>
                        <div id="lt-btn-mult-k" class="lt-mult-btn ${this.savedSettings.multKey==='k'?'active':''}">K (Thous)</div>
                        <div id="lt-btn-mult-m" class="lt-mult-btn ${this.savedSettings.multKey==='m'?'active':''}">M (Mill)</div>
                        <div id="lt-btn-mult-b" class="lt-mult-btn ${this.savedSettings.multKey==='b'?'active':''}">B (Bill)</div>
                    </div>

                    <div id="lt-mode-bankroll"><div class="lt-input-group"><span class="lt-label">Bankroll</span><input id="lt-inp-bankroll" class="lt-input" type="number" value="${this.savedSettings.bankroll}"></div><div class="lt-input-group"><span class="lt-label">Risk %</span><input id="lt-inp-risk" class="lt-input" type="number" value="${this.savedSettings.risk}"></div></div>
                    <div id="lt-mode-target" class="lt-hidden"><div class="lt-input-group"><span class="lt-label">Target</span><input id="lt-inp-target" class="lt-input" type="number" value="${this.savedSettings.target}"></div></div>
                    <div class="lt-input-group"><span class="lt-label">Parts</span><input id="lt-inp-parts" class="lt-input" type="number" value="${this.savedSettings.parts}"></div>
                    <div style="margin-top:12px;display:flex;gap:15px;">
                        <label class="lt-checkbox-row"><input type="checkbox" id="lt-chk-integers" class="lt-checkbox" ${this.savedSettings.integers?'checked':''}> Whole Numbers</label>
                        <label class="lt-checkbox-row"><input type="checkbox" id="lt-chk-uniform" class="lt-checkbox" ${this.savedSettings.uniform?'checked':''}> Equal Split</label>
                    </div>

                    <!-- V7.00: Preview Section -->
                    <div id="lt-gen-preview" style="margin-top:15px;padding:12px;background:rgba(124,58,237,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:6px;display:none;">
                        <div style="font-size:11px;color:#a78bfa;font-weight:bold;margin-bottom:8px;">📊 PREVIEW</div>
                        <div id="lt-gen-preview-stats" style="font-size:11px;color:#cbd5e1;margin-bottom:8px;"></div>
                        <div id="lt-gen-preview-seq" style="display:flex;flex-wrap:wrap;gap:4px;max-height:60px;overflow-y:auto;"></div>
                    </div>

                    <button id="lt-btn-generate" class="lt-btn lt-btn-primary" style="margin-top:15px;">Generate</button>
                    <button id="lt-btn-reset-all" class="lt-btn lt-btn-reset">⚠️ Reset Data</button>
                </div>

                <div id="lt-history-panel" class="lt-hidden" style="background:#0f172a;padding:10px;border-radius:8px;border:1px solid #334155;margin-top:10px;">
                    <h4 style="color:#e2e8f0;margin:0 0 10px 0;font-size:14px;text-align:center;">History</h4><div id="lt-history-list" class="lt-history-list"></div><button id="lt-btn-close-hist" class="lt-btn lt-btn-action" style="margin-top:10px;">Close</button>
                </div>

                <div id="lt-info-panel" class="lt-hidden" style="background:#0f172a;padding:15px;border-radius:8px;border:1px solid #334155;margin-top:10px;max-height:400px;overflow-y:auto;">
                    <div class="lt-info-grid">
                        <div class="lt-info-card">
                            <div class="lt-info-head">📖 Strategy Guide (Labouchere)</div>
                            <ul class="lt-info-list">
                                <li>Set a <b>Target</b> (Profit Goal).</li>
                                <li>The script splits this into a sequence.</li>
                                <li><b>Bet:</b> First + Last Number.</li>
                                <li><b>Win:</b> Numbers are crossed out.</li>
                                <li><b>Loss:</b> Bet is added to the end.</li>
                            </ul>
                        </div>
                        <div class="lt-info-card">
                            <div class="lt-info-head">🚀 Features</div>
                            <ul class="lt-info-list">
                                <li><b>Auto-Detect:</b> Detects Wins/Losses automatically.</li>
                                <li><b>Smart Drag & Drop:</b> Reorder numbers via mouse.</li>
                                <li><b>Multiplier:</b> Use K/M/B buttons for input.</li>
                                <li><b>Pot Scanner:</b> Infers bet from Pot Money.</li>
                                <li><b>Safe Lock:</b> Prevents double-counting wins.</li>
                            </ul>
                        </div>
                        <div class="lt-info-card">
                            <div class="lt-info-head">🎛️ Controls</div>
                            <ul class="lt-info-list">
                                <li><b>Split:</b> Click a number to split it.</li>
                                <li><b>Merge:</b> Select two numbers to merge them.</li>
                                <li><b>Undo:</b> "Last Round" reverts the last action.</li>
                                <li><b>Custom Bet:</b> Click the purple box.</li>
                            </ul>
                        </div>
                        <div class="lt-info-card">
                            <div class="lt-info-head">⚖️ Terms of Service & Risk Disclosure</div>
                            <table class="lt-tos-table">
                                <tr><th>Item</th><th>Details</th></tr>
                                <tr><td>License</td><td>Free to use. Provided "as is" without warranty.</td></tr>
                                <tr><td>Risk</td><td>Gambling involves financial risk. The Labouchere strategy can lead to high bets during losing streaks.</td></tr>
                                <tr><td>Torn Rules</td><td>This is a helper tool. It does not automate clicks (Macroing). Use responsibly to avoid bans.</td></tr>
                                <tr><td>Data Privacy</td><td>Operates 100% locally. Reads User ID & Game Data to function. No data is sent to external servers.</td></tr>
                                <tr><td>Responsibility</td><td>The author is not responsible for any virtual money lost while using this script.</td></tr>
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

            // Toggle Panels
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
            document.getElementById('lt-btn-reset-all').onclick = () => { if(confirm("Reset all data?")) engine.resetData(); };

            // V7.00: Preview on input change
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
            document.getElementById('lt-btn-merge').onclick = () => { this.mergeMode = !this.mergeMode; this.selectedForMerge = []; this.update(); };
            document.getElementById('lt-btn-confirm-merge').onclick = () => { engine.mergeList(this.selectedForMerge); this.selectedForMerge=[]; this.mergeMode=false; this.update(); };
            document.getElementById('lt-btn-auto').onclick = () => engine.toggleAutoDetect();
            document.getElementById('lt-btn-undo').onclick = () => engine.undo();
            document.getElementById('lt-btn-reset-bet').onclick = () => {
                engine.resetBet();
                Utils.showToast('Bet Reset');
                this.update();
            };
            document.getElementById('lt-bet-box').onclick = () => {
                // V7.02: Improved Custom Bet dialog
                const currentCustom = engine.state.customBet;
                const expectedBet = engine.getEffectiveBet();

                let promptText = "Custom Bet (Total Amount):";
                if (currentCustom !== null) {
                    promptText = `Custom Bet Active: ${Utils.formatNumber(currentCustom)}\n\nEnter new amount (0 to clear):`;
                } else {
                    promptText = `Expected Bet: ${Utils.formatNumber(expectedBet)}\n\nEnter Custom Bet (0 to use expected):`;
                }

                const inp = prompt(promptText, currentCustom || expectedBet);
                if(inp !== null) {
                    const v = parseFloat(inp);
                    if(!isNaN(v) && v > 0) {
                        engine.setCustomBet(v);
                        Utils.showToast(`Custom Bet Set: ${Utils.formatNumber(v)}`);
                    } else if(v === 0) {
                        engine.clearCustomBet();
                        Utils.showToast("Custom Bet Cleared");
                    }
                }
            };
            this.update();
        }
        // --- RESTORED METHODS ---
        switchGenMode(mode) {
            this.genMode = mode; this.saveSettingsFromUI();
            const b = document.getElementById('lt-mode-bankroll'); const t = document.getElementById('lt-mode-target');
            const tb = document.getElementById('lt-tab-bankroll'); const tt = document.getElementById('lt-tab-target');
            if(mode==='bankroll'){ b.classList.remove('lt-hidden'); t.classList.add('lt-hidden'); tb.classList.add('active'); tt.classList.remove('active'); }
            else { b.classList.add('lt-hidden'); t.classList.remove('lt-hidden'); tb.classList.remove('active'); tt.classList.add('active'); }
            this.updateInputPreviews();
            this.updatePreview();
        }

        // V7.00: Live Preview of Sequence
        updatePreview() {
            const preview = document.getElementById('lt-gen-preview');
            const statsEl = document.getElementById('lt-gen-preview-stats');
            const seqEl = document.getElementById('lt-gen-preview-seq');

            if (!preview || !statsEl || !seqEl) return;

            try {
                // Get current inputs
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

                // Hide preview if invalid
                if (errorMsg || target <= 0 || parts <= 0) {
                    preview.style.display = 'none';
                    return;
                }

                // Generate preview sequence
                const previewSeq = Utils.generateSequence(target, parts, uniform, useIntegers);
                const actualSum = previewSeq.reduce((a, b) => a + b, 0);
                const deviation = Math.abs(actualSum - target);
                const deviationPercent = ((deviation / target) * 100).toFixed(2);

                // Show stats
                statsEl.innerHTML = `
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <div><span style="color:#94a3b8;">Target:</span> <b style="color:#fff;">${Utils.formatNumber(target)}</b></div>
                        <div><span style="color:#94a3b8;">Parts:</span> <b style="color:#fff;">${parts}</b></div>
                        <div><span style="color:#94a3b8;">Actual Sum:</span> <b style="color:${deviation < 1 ? '#4ade80' : '#fbbf24'};">${Utils.formatNumber(actualSum)}</b></div>
                        <div><span style="color:#94a3b8;">Deviation:</span> <b style="color:${deviation < 1 ? '#4ade80' : deviation < 10 ? '#fbbf24' : '#f87171'};">${deviationPercent}%</b></div>
                    </div>
                `;

                // Show sequence badges
                seqEl.innerHTML = previewSeq.map(val =>
                    `<span style="background:#1e293b;border:1px solid rgba(124,58,237,0.3);padding:4px 8px;border-radius:4px;font-size:10px;color:#cbd5e1;font-family:monospace;">${val}</span>`
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

                // V6.29: Using short numbers for generation logic
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

                // Calculate internal profit with multiplier
                const mult = this.savedSettings.multVal || 1;
                const totalProfitVal = s.totalProfit * mult;

                const bd = document.getElementById('lt-bet-display'); const bb = document.getElementById('lt-bet-box');
                bd.innerText = Utils.formatNumber(bet);
                if(s.customBet!==null) { bd.classList.add('override'); bb.classList.add('override'); } else { bd.classList.remove('override'); bb.classList.remove('override'); }

                const ab = document.getElementById('lt-btn-auto');
                if(s.autoDetect) { ab.innerText="Auto: ON"; ab.classList.add('active'); } else { ab.innerText="Auto: OFF"; ab.classList.remove('active'); }

                // V6.33 FIX: Correctly sum up sequence values (objects)
                const rawSum = s.sequence.reduce((a,b) => a + (b.value || 0), 0);
                document.getElementById('lt-rem-val').innerText = Utils.formatNumber(rawSum * mult);

                document.getElementById('lt-prof-val').innerText = Utils.formatNumber(totalProfitVal);
                document.getElementById('lt-prof-val').style.color = totalProfitVal>=0?'#4ade80':'#f87171';

                // V6.33: Calc Streak & Winrate
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

                // Update Rounds Counter
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
                if(this.mergeMode) mt.classList.add('lt-btn-active'); else mt.classList.remove('lt-btn-active');
                if(this.mergeMode && this.selectedForMerge.length>=2) { mb.classList.remove('lt-hidden'); mb.innerText=`✓ Confirm Merge (${this.selectedForMerge.length})`; } else mb.classList.add('lt-hidden');

                const cont = document.getElementById('lt-sequence'); const pa = document.getElementById('lt-play-again-container');
                if(s.sequence.length===0 && s.roundCount>0) { cont.style.display='none'; pa.style.display='flex'; }
                else {
                    cont.style.display='flex'; pa.style.display='none'; cont.innerHTML='';
                    if(s.sequence.length===0) cont.innerHTML='<div style="color:#666;font-size:11px">New Game</div>';
                    else s.sequence.forEach((item,idx) => {
                        const el=document.createElement('div'); el.className='lt-badge';
                        if(!this.mergeMode && (idx===0||idx===s.sequence.length-1)) { el.style.borderColor='#22c55e'; el.style.color='#4ade80'; }
                        if(this.mergeMode && this.selectedForMerge.includes(idx)) el.classList.add('selected');

                        // V6.29: Display SHORT number in sequence
                        el.innerText = Utils.formatNumber(item.value);

                        // CLICK HANDLER
                        if(!this.mergeMode) {
                             el.onclick=()=>{ const v=prompt("Split value:", item.value/2); if(v){ const n=parseFloat(v); if(n>0 && n<item.value) engine.splitItem(idx,n); } };
                        } else {
                             el.onclick=()=>{ if(this.selectedForMerge.includes(idx)) this.selectedForMerge=this.selectedForMerge.filter(i=>i!==idx); else this.selectedForMerge.push(idx); this.update(); };
                        }

                        // SMART DRAG & DROP LOGIC (V6.26)
                        if (!this.mergeMode) {
                            el.draggable = true;
                            el.addEventListener('dragstart', (e) => {
                                this.dragSrcIndex = idx;
                                e.dataTransfer.effectAllowed = 'move';
                                el.classList.add('dragging');
                            });
                            el.addEventListener('dragover', (e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'move';
                                const rect = el.getBoundingClientRect();
                                const mid = rect.left + (rect.width / 2);
                                el.classList.remove('drop-left', 'drop-right');
                                if (e.clientX < mid) {
                                    el.classList.add('drop-left');
                                } else {
                                    el.classList.add('drop-right');
                                }
                            });
                            el.addEventListener('dragleave', () => {
                                el.classList.remove('drop-left', 'drop-right');
                            });
                            el.addEventListener('dragend', () => {
                                el.classList.remove('dragging');
                                document.querySelectorAll('.lt-badge').forEach(b => b.classList.remove('drop-left', 'drop-right'));
                            });
                            el.addEventListener('drop', (e) => {
                                e.stopPropagation();
                                el.classList.remove('drop-left', 'drop-right');
                                const rect = el.getBoundingClientRect();
                                const mid = rect.left + (rect.width / 2);
                                let targetIdx = idx;
                                if (e.clientX >= mid) {
                                    targetIdx++;
                                }
                                if (this.dragSrcIndex !== null && this.dragSrcIndex !== targetIdx) {
                                    engine.reorderSequence(this.dragSrcIndex, targetIdx);
                                }
                                return false;
                            });
                        }
                        cont.appendChild(el);
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
            const fb = document.getElementById('lt-fill-btn'); if(fb) fb.innerText=amt>0?`📋 ${Utils.formatNumber(amt)}`:"✅";
        }
    }

    // --- INTEGRATION (V6.26 HYBRID & ASYNC SCANNER) ---
    class TornIntegration {
        constructor() {
            this.isRR = false; this.myId = this.getMyId();
            this.isArmed = false; this.lastManualBet = null;
            this.hospitalLock = 0;
            this.isProcessing = false;
            this.lockResults = false;

            // V7.01 FIX: Duplicate detection
            this.lastProcessedWinner = null;
            this.lastProcessedTime = 0;

            // V7.04 FIX: Text deduplication for DOM messages
            this.lastProcessedDomText = null;
            this.lastProcessedDomTime = 0;
            this.pendingDomProcess = false;

            // Make available globally so DevTool can trigger it
            window.LabTrackIntegration = this;

            this.installNetworkHooks();

            // Observer for DOM changes
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
        getMyId() { const m = document.cookie.match(/uid=(\d+)/); return m ? parseInt(m[1], 10) : null; }
        setUI(ui) { this.ui = ui; }

        start() {
            if(document.body) {
                this.hospitalObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
                // V7.05: DOM Spy disabled - using Network-only detection to prevent duplicate processing
                // this.startDomSpy();
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

        // V6.31: Smart Pot Money Scanner
        scanPotMoney() {
            // Only scan if we are not locked/processing and in RR
            if (this.lockResults || !this.isRR) return;

            // Try to find the element by TEXT content to be robust against class changes
            // Searching for "POT MONEY:" label
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
                    const valText = potLabel.nextElementSibling.innerText; // e.g. "$20"
                    const val = parseFloat(valText.replace(/[^0-9.]/g, ''));

                    if (!isNaN(val) && val > 0) {
                        // V6.32 FIX: If pendingBet is not set, use HALF of Pot.
                        if (engine.pendingBet === null) {
                             engine.setPendingBet(val / 2);
                             // devTool.log('dom', 'POT', `Bet inferred from Pot: ${val/2}`);
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
                     // V7.06 FIX: Reset all duplicate detection on lobby return
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

        // --- ASYNC DOM SPY (V7.04 ENHANCED - Fixed duplicate processing) ---
        startDomSpy() {
            const observer = new MutationObserver((mutations) => {
                // V7.04 FIX: Collect all texts from this batch FIRST, then dedupe
                const textsToProcess = new Set();

                mutations.forEach(m => {
                    m.addedNodes.forEach(node => {
                        if(node.nodeType === 1) { // Element
                            try {
                                // V7.04 FIX: Only match the INNERMOST message element to avoid duplicates
                                let messageEl = null;
                                if (node.matches && node.matches("[class*='message']")) {
                                    // Check if this node has a child message element (prefer the child)
                                    const childMsg = node.querySelector("[class*='message']");
                                    messageEl = childMsg || node;
                                } else if (node.querySelector) {
                                    messageEl = node.querySelector("[class*='message']");
                                }

                                if (messageEl) {
                                    const text = (messageEl.innerText || "").trim();
                                    if (text.length >= 5) {
                                        textsToProcess.add(text);
                                    }
                                }
                            } catch(e){}
                        }
                    });
                });

                // V7.04 FIX: Process each unique text only ONCE per mutation batch
                if (textsToProcess.size > 0 && !this.pendingDomProcess) {
                    this.pendingDomProcess = true;
                    setTimeout(() => {
                        textsToProcess.forEach(text => {
                            this.handleDomMessage(text);
                        });
                        this.pendingDomProcess = false;
                    }, 50);
                }
            });
            const target = document.querySelector('#mainContainer') || document.body;
            if (target) {
                observer.observe(target, { childList: true, subtree: true });
            }
        }

        handleDomMessage(text) {
            if (!engine.state.autoDetect || this.lockResults || this.isProcessing) return;

            const lower = text.toLowerCase();
            let outcome = 'none';

            // Filter Noise
            if (lower.includes("waiting") || lower.includes("sound on") || lower.includes("pot money")) return;

            // Check WIN: "You take your winnings"
            if (lower.includes("you take your winnings")) {
                outcome = 'win';
            }
            // Check LOSS: "You fall down", "You missed", "Shot himself"
            else if ((lower.includes("you") && lower.includes("fall down")) || lower.includes("you missed") || lower.includes("shot himself")) {
                outcome = 'loss';
            }

            if (outcome !== 'none') {
                // V7.04 FIX: Text deduplication - prevent processing same message twice within 3 seconds
                const now = Date.now();
                const textKey = `${outcome}_${lower.substring(0, 30)}`;
                if (this.lastProcessedDomText === textKey && (now - this.lastProcessedDomTime < 3000)) {
                    devTool.log('dom', 'SKIP', `Duplicate DOM message: ${outcome}`);
                    return;
                }

                // V7.01 FIX: Set locks IMMEDIATELY before triggerResult to prevent race conditions
                this.isProcessing = true;
                this.lockResults = true;

                // V7.04 FIX: Mark this text as processed
                this.lastProcessedDomText = textKey;
                this.lastProcessedDomTime = now;

                devTool.log('dom', 'TRIGGER', `Result detected: ${outcome}`);
                this.triggerResult(outcome, 0);
            }
        }

        triggerResult(outcome, stake) {
            // V7.01 FIX: Check if already being processed
            // Locks should have been set by caller (DOM or Network handler)
            // If somehow we get here without locks, something is wrong
            if (!this.lockResults || !this.isProcessing) {
                devTool.log('net', 'ERROR', 'triggerResult called without locks set!');
                this.isProcessing = true;
                this.lockResults = true;
            }

            // Get stake from engine if missing
            let finalStake = stake;
            if (!finalStake) finalStake = engine.pendingBet || engine.getEffectiveBet();

            if (outcome === 'win') {
                engine.processWin();
                if(this.ui) {
                    this.ui.flash('win');
                    Utils.showToast(`WIN (Verified): ${Utils.formatNumber(finalStake)}`);
                    this.hospitalLock = 0;
                    this.ui.toggleHospital(false);
                }
                devTool.log('net', "RESULT", "WIN (Hybrid) processed. Locked.");
            } else if (outcome === 'loss') {
                engine.processLoss(finalStake);
                if(this.ui) {
                    this.ui.flash('loss');
                    Utils.showToast(`LOSS (Verified): ${Utils.formatNumber(finalStake)}`);
                    this.ui.toggleHospital(true);
                    this.hospitalLock = Date.now() + CONFIG.HOSPITAL_LOCK_MS;
                }
                devTool.log('net', "RESULT", "LOSS (Hybrid) processed. Locked.");
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
                // V6.30: Enhanced hook for debugging custom bets
                if(typeof body==='string' && (body.includes('sid=russianRouletteData')||window.location.href.includes('russianRoulette'))) {
                    console.log("[LabTrack] XHR POST:", body); // Debug log
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
                const url = args[0]?args[0].toString():"";
                if(self.isRR && url.includes('russianRouletteData') && args[1]?.body) {
                    const bodyStr = args[1].body.toString();
                    console.log("[LabTrack] Fetch POST:", bodyStr);
                    devTool.log('net', "FETCH", bodyStr.substring(0, 50));

                    const m = bodyStr.match(/amount=(\d+)/);
                    if(m) engine.setPendingBet(parseInt(m[1]));
                }
                const res = await origFetch.apply(this, args);
                const c = res.clone(); c.text().then(t => {
                    if(url.includes('russianRouletteData')) self.scanTextForResults(t);
                    self.checkHospitalNetwork(t);
                }).catch(()=>{});
                return res;
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

            // V7.05 FIX: Quick pre-check - does this text even contain a winner?
            if(!text || text.length<10 || text.indexOf('winner')===-1) return;

            // V7.05 FIX: Extract winnerId FIRST, then do atomic check
            const winnerMatch = text.match(/"winner"\s*:\s*"?(\d+)"?/);
            if(!winnerMatch) return;
            const winnerId = parseInt(winnerMatch[1], 10);
            if(winnerId===0) return;

            // V7.06 FIX: TRUE ATOMIC CHECK - Set FIRST, then check previous value
            // This prevents TOCTOU race condition where two calls both pass the check
            // before either sets the lock
            const prevLock = this._winnerLock;
            this._winnerLock = winnerId;  // SET IMMEDIATELY before any check
            if (prevLock === winnerId) {
                return; // Another call is already processing this exact winner
            }

            // Additional time-based check for safety (different game rounds with same winner)
            const now = Date.now();
            if (this.lastSeenWinnerId === winnerId && (now - this.lastSeenWinnerTime < 5000)) {
                this._winnerLock = null; // Release lock
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
                    // V7.01 FIX: DOUBLE CHECK - locks might have been set by DOM already
                    if (this.lockResults || this.isProcessing) {
                        devTool.log('net', 'SKIP', 'Already locked by DOM detection');
                        return;
                    }

                    // V7.01 FIX: Set locks IMMEDIATELY before triggerResult
                    this.isProcessing = true;
                    this.lockResults = true;

                    // V7.01 FIX: Mark this winnerId as processed
                    this.lastProcessedWinner = winnerId;
                    this.lastProcessedTime = Date.now();

                    let val=0, isPot=false;
                    const mm = text.match(/"(pot_amount|betAmount|amount|money)"\s*:\s*"?(\d+(\.\d+)?)"?/);
                    if(mm) { val=parseFloat(mm[2]); if(mm[1]==='pot_amount') isPot=true; }
                    let netStake = isPot ? val/2 : val;

                    this.triggerResult(outcome, netStake);
                } else {
                     devTool.log('net', "IGNORE", "Spectator / Not Involved");
                     this._winnerLock = null; // Release lock for spectator
                }

            } catch(e) {
                console.error("[LabTrack] Scan Err", e);
                devTool.log('net', "ERR", e.message);
                this.isProcessing = false;
                this._winnerLock = null; // Release lock on error
            }
        }
        initDOMButtons() {
            const inp = document.querySelector('input[aria-label="Money value"]');
            if(inp && !inp.hasAttribute('data-lt')) {
                inp.setAttribute('data-lt','1');

                // V7.02: Auto-detect Custom Bets
                const capture = (e) => {
                    const v = parseFloat(e.target.value.replace(/[^0-9.]/g,''));
                    if(!isNaN(v) && v > 0) {
                        this.lastManualBet = { amount: v, time: Date.now() };

                        // V7.02: Auto-detect if bet differs from expected
                        const expectedBet = engine.getEffectiveBet();
                        const tolerance = 1; // Allow 1$ difference for rounding

                        if (Math.abs(v - expectedBet) > tolerance) {
                            // User entered a different bet - set as custom bet
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
                const btn = document.createElement("button"); btn.id="lt-fill-btn"; btn.innerText="📋";
                btn.style.cssText="margin-left:5px;background:#6d28d9;color:fff;border:none;border-radius:4px;cursor:pointer;padding:0 10px;height:34px;font-weight:bold;";
                btn.onclick = (e) => { e.preventDefault(); const v=engine.getEffectiveBet(); if(v>0){ Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set.call(inp,Math.floor(v)); inp.dispatchEvent(new Event('input',{bubbles:true})); } };
                if(inp.parentNode) inp.parentNode.appendChild(btn);
                if(this.ui) this.ui.update();
            }
        }
        initTrade() {
            const inp = document.querySelector(".user-id.input-money");
            if(!inp || document.getElementById('lt-trade-pnl')) return;
            const p = document.createElement('div'); p.id='lt-trade-pnl'; p.style.cssText="margin-top:5px;display:flex;gap:5px;width:100%";
            const mkBtn=(t,fn)=>{const b=document.createElement('button');b.innerText=t;b.style.cssText="flex:1;background:#242424;color:#888;padding:5px;border:1px solid #444;border-radius:4px;font-size:11px;cursor:pointer;";b.onclick=e=>{e.preventDefault();fn();};return b;};
            const setV=v=>{ let c=parseInt(inp.value.replace(/[^0-9]/g,''))||0; Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"value").set.call(inp,Math.max(0,c-v)); inp.dispatchEvent(new Event('input',{bubbles:true})); };
            p.appendChild(mkBtn("Wait...",()=>setV(engine.getEffectiveBet()))); p.appendChild(mkBtn("Wait...",()=>setV(engine.getEffectiveBet()+20)));
            p.firstChild.id="lt-trade-btn-1"; p.lastChild.id="lt-trade-btn-2";
            if(inp.parentNode.classList.contains("input-money-group")) inp.parentNode.parentNode.insertBefore(p,inp.parentNode.nextSibling); else inp.parentNode.insertBefore(p,inp.nextSibling);
            if(this.ui) this.ui.updateExternalButtons();
        }
    }

    // =============================================================================
    // INITIALIZATION - V7.00
    // =============================================================================
    Logger.info('INIT', `LabTrack Enhanced v${CONFIG.VERSION} starting...`);
    Logger.info('INIT', 'Enhancements: CONFIG constants, Logger, Validator, Performance utils, Error handling');

    const integration = new TornIntegration();
    const waitForBody = () => {
        if (!document.body) {
            setTimeout(waitForBody, CONFIG.DOM_DELAY_MS);
        } else {
            const ui = new OverlayUI();
            ui.init();
            integration.setUI(ui);
            integration.start();
            Logger.info('INIT', 'LabTrack Enhanced initialization complete ✓');
        }
    };
    waitForBody();

    // Make devTool globally accessible
    window.ltDevTool = devTool;
})();