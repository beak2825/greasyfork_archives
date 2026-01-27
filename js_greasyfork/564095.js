// ==UserScript==
// @name         Claude Projects Manager (v4)
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Organize your Claude.ai Projects with view modes, favorites, colors, search, tooltips & backup!
// @author       Solomon
// @match        https://claude.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564095/Claude%20Projects%20Manager%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564095/Claude%20Projects%20Manager%20%28v4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // 🎯 CLAUDE PROJECTS MANAGER v4
    // ============================================
    // Changelog v4:
    // - 🔧 Fixed widget visibility issues
    // - 🔧 Better URL detection for projects page
    // - 🔧 Explicit display:block for panel show
    // - 🔧 Improved initialization timing
    // - 🔧 Added debug logging (can disable)
    // - 🔧 Fixed storage key consistency
    // - 🔧 Better viewport boundary checks
    // ============================================
    // Features:
    // - 🎨 4 View Modes (Cards, Compact, List, Mini)
    // - ⭐ Favorites (pin to top)
    // - 🌈 8 Color options
    // - 🔍 Instant search
    // - 💬 Hover tooltips
    // - 💾 Auto-backup
    // - 🖱️ Draggable panel
    // - ⌨️ Keyboard shortcuts
    // - 🔴 Project header color indicator
    // ============================================

    const DEBUG = true; // Set to false to disable console logging
    const STORAGE_PREFIX = 'cpm_v4_';

    function log(...args) {
        if (DEBUG) console.log('📁 CPM v4:', ...args);
    }

    let settings = {
        viewMode: 'compact',
        panelMinimized: false, // Changed default to false so panel is visible initially
        panelX: null,
        panelY: 12,
        panelWidth: 140,
        panelHeight: 250,
        autoBackup: 'off',
        lastAutoBackup: ''
    };

    let favorites = [];
    let projectColors = {};
    let isInitialized = false;
    let lastUrl = '';
    let panelCreated = false;

    // 💾 STORAGE
    function loadSettings() {
        try {
            const saved = GM_getValue(STORAGE_PREFIX + 'settings', null);
            if (saved) {
                const parsed = JSON.parse(saved);
                settings = { ...settings, ...parsed };
                log('Settings loaded:', settings);
            }
            favorites = JSON.parse(GM_getValue(STORAGE_PREFIX + 'favs', '[]'));
            projectColors = JSON.parse(GM_getValue(STORAGE_PREFIX + 'colors', '{}'));
            log('Favorites:', favorites.length, 'Colors:', Object.keys(projectColors).length);
        } catch (e) {
            log('Error loading settings:', e);
        }
    }

    function saveSettings() {
        GM_setValue(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
        log('Settings saved');
    }
    function saveFavorites() { GM_setValue(STORAGE_PREFIX + 'favs', JSON.stringify(favorites)); }
    function saveColors() { GM_setValue(STORAGE_PREFIX + 'colors', JSON.stringify(projectColors)); }

    // ============================================
    // 📦 BACKUP SYSTEM
    // ============================================

    function getTodayDate() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function getWeekNumber() {
        const d = new Date();
        const start = new Date(d.getFullYear(), 0, 1);
        const days = Math.floor((d - start) / 86400000);
        return d.getFullYear() + '-W' + Math.ceil((days + start.getDay() + 1) / 7);
    }

    function getMonthKey() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    }

    function getAllData() {
        return {
            version: 4,
            exportDate: new Date().toISOString(),
            settings: settings,
            favorites: favorites,
            projectColors: projectColors
        };
    }

    function downloadBackupFile(filename) {
        const data = getAllData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || `claude-projects-backup-${getTodayDate()}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportSettings() { downloadBackupFile(); }

    function importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data.settings) { settings = { ...settings, ...data.settings }; saveSettings(); }
                    if (data.favorites) { favorites = data.favorites; saveFavorites(); }
                    if (data.projectColors) { projectColors = data.projectColors; saveColors(); }
                    alert('✅ Imported! Reloading...');
                    location.reload();
                } catch (err) { alert('❌ Error: ' + err.message); }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function checkAutoBackup() {
        if (settings.autoBackup === 'off') return;
        let currentKey;
        if (settings.autoBackup === 'daily') currentKey = getTodayDate();
        else if (settings.autoBackup === 'weekly') currentKey = getWeekNumber();
        else if (settings.autoBackup === 'monthly') currentKey = getMonthKey();
        else return;
        if (settings.lastAutoBackup === currentKey) return;
        log('Auto backup for', currentKey);
        downloadBackupFile(`claude-projects-auto-backup-${getTodayDate()}.json`);
        settings.lastAutoBackup = currentKey;
        saveSettings();
    }

    function showBackupSettings() {
        const modal = document.createElement('div');
        modal.id = 'cpm-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:white;padding:12px;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,0.2);min-width:180px;font-family:system-ui;font-size:11px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <b>💾 Backup</b>
                    <span id="cpm-close" style="cursor:pointer;font-size:14px;">✕</span>
                </div>
                <div style="margin-bottom:10px;">
                    <div style="font-size:9px;color:#666;margin-bottom:4px;">AUTO BACKUP</div>
                    <select id="cpm-freq" style="width:100%;padding:5px;border:1px solid #ccc;border-radius:4px;font-size:10px;">
                        <option value="off" ${settings.autoBackup === 'off' ? 'selected' : ''}>Off</option>
                        <option value="daily" ${settings.autoBackup === 'daily' ? 'selected' : ''}>Daily</option>
                        <option value="weekly" ${settings.autoBackup === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="monthly" ${settings.autoBackup === 'monthly' ? 'selected' : ''}>Monthly</option>
                    </select>
                </div>
                <div style="display:flex;gap:4px;margin-bottom:6px;">
                    <button id="cpm-export" style="flex:1;padding:5px;border:1px solid #ccc;border-radius:4px;background:#f0f0f0;cursor:pointer;font-size:9px;">📤 Export</button>
                    <button id="cpm-import" style="flex:1;padding:5px;border:1px solid #ccc;border-radius:4px;background:#f0f0f0;cursor:pointer;font-size:9px;">📥 Import</button>
                </div>
                <button id="cpm-save" style="width:100%;padding:6px;border:none;border-radius:4px;background:#7c7cf5;color:white;cursor:pointer;font-size:10px;">Save</button>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#cpm-close').onclick = () => modal.remove();
        modal.onclick = e => { if (e.target === modal) modal.remove(); };
        modal.querySelector('#cpm-export').onclick = () => exportSettings();
        modal.querySelector('#cpm-import').onclick = () => { modal.remove(); importSettings(); };
        modal.querySelector('#cpm-save').onclick = () => {
            settings.autoBackup = modal.querySelector('#cpm-freq').value;
            settings.lastAutoBackup = '';
            saveSettings();
            modal.remove();
        };
    }

    // 🌈 COLORS
    const DEFAULT_COLOR = { border: '#98d8aa', bg: 'rgba(152,216,170,0.15)' };

    const MANUAL_COLORS = [
        { id: 'none', border: '#98d8aa', bg: 'rgba(152,216,170,0.15)' },
        { id: 'red', border: '#ff6b6b', bg: 'rgba(255,107,107,0.18)' },
        { id: 'orange', border: '#ffa94d', bg: 'rgba(255,169,77,0.18)' },
        { id: 'yellow', border: '#ffd43b', bg: 'rgba(255,212,59,0.20)' },
        { id: 'green', border: '#51cf66', bg: 'rgba(81,207,102,0.18)' },
        { id: 'blue', border: '#4dabf7', bg: 'rgba(77,171,247,0.18)' },
        { id: 'purple', border: '#be4bdb', bg: 'rgba(190,75,219,0.18)' },
        { id: 'pink', border: '#f783ac', bg: 'rgba(247,131,172,0.18)' },
    ];

    // 🎨 STYLES
    function injectStyles() {
        if (document.getElementById('cpm-styles')) return;
        const style = document.createElement('style');
        style.id = 'cpm-styles';
        style.textContent = `
            @keyframes cpm-border-chase {
                0% { background-position: 0% 0%, 100% 0%, 100% 100%, 0% 100%; }
                25% { background-position: 100% 0%, 100% 100%, 0% 100%, 0% 0%; }
                50% { background-position: 100% 100%, 0% 100%, 0% 0%, 100% 0%; }
                75% { background-position: 0% 100%, 0% 0%, 100% 0%, 100% 100%; }
                100% { background-position: 0% 0%, 100% 0%, 100% 100%, 0% 100%; }
            }

            @keyframes cpm-glow-pulse {
                0%, 100% { box-shadow: 0 0 5px #7c7cf5, 0 0 10px #7c7cf5, 0 0 20px rgba(124, 124, 245, 0.5); }
                50% { box-shadow: 0 0 10px #a78bfa, 0 0 20px #a78bfa, 0 0 30px rgba(167, 139, 250, 0.6); }
            }

            @keyframes cpm-tooltip-in {
                0% { opacity: 0; transform: translateY(5px) scale(0.95); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
            }

            #cpm-panel {
                position: fixed !important;
                z-index: 999999 !important;
                background: #f8f8fa !important;
                border: 1px solid #ddd !important;
                border-radius: 6px !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                color: #333 !important;
                user-select: none !important;
                overflow: visible !important;
                font-size: 9px !important;
                display: block !important;
            }

            #cpm-panel.cpm-hidden {
                display: none !important;
            }

            #cpm-panel.minimized #cpm-body, #cpm-panel.minimized #cpm-resize { display: none !important; }
            #cpm-panel.minimized { width: auto !important; height: auto !important; }

            #cpm-header {
                background: linear-gradient(135deg, #7c7cf5, #a78bfa) !important;
                padding: 4px 8px !important;
                border-radius: 5px 5px 0 0 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                cursor: pointer !important;
                min-width: 24px !important;
                min-height: 18px !important;
            }

            #cpm-panel.minimized #cpm-header { border-radius: 5px !important; }

            #cpm-header:hover {
                background: linear-gradient(135deg, #6b6be0, #9678e8) !important;
            }

            #cpm-header .toggle-icon {
                color: white !important;
                font-size: 14px !important;
                font-weight: bold !important;
                line-height: 1 !important;
            }

            #cpm-body {
                padding: 5px !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 5px !important;
                overflow-y: auto !important;
                background: #f8f8fa !important;
                height: calc(100% - 26px) !important;
                box-sizing: border-box !important;
            }

            .cpm-sec-title { font-size: 7px !important; text-transform: uppercase !important; letter-spacing: 0.3px !important; color: #888 !important; margin-bottom: 2px !important; font-weight: 600 !important; }
            .cpm-view-row { display: flex !important; gap: 2px !important; }

            .cpm-vbtn {
                flex: 1 !important;
                background: #eee !important;
                border: 1px solid transparent !important;
                padding: 3px 2px !important;
                border-radius: 3px !important;
                color: #666 !important;
                cursor: pointer !important;
                text-align: center !important;
                font-size: 9px !important;
                line-height: 1 !important;
            }
            .cpm-vbtn:hover { background: #e0e0e0 !important; color: #333 !important; }
            .cpm-vbtn.active { background: #7c7cf5 !important; border-color: #a78bfa !important; color: white !important; }

            #cpm-search {
                width: 100% !important;
                padding: 4px 5px !important;
                background: white !important;
                border: 1px solid #ddd !important;
                border-radius: 3px !important;
                color: #333 !important;
                font-size: 9px !important;
                box-sizing: border-box !important;
            }
            #cpm-search:focus { outline: none !important; border-color: #7c7cf5 !important; }

            .cpm-stats { display: flex !important; justify-content: space-around !important; text-align: center !important; padding: 2px 0 !important; }
            .cpm-stat-num { font-size: 12px !important; font-weight: bold !important; color: #7c7cf5 !important; }
            .cpm-stat-lbl { font-size: 6px !important; color: #999 !important; text-transform: uppercase !important; }

            .cpm-backup-btn {
                width: 100% !important;
                padding: 4px !important;
                background: #eee !important;
                border: 1px solid #ddd !important;
                border-radius: 3px !important;
                color: #666 !important;
                cursor: pointer !important;
                font-size: 8px !important;
                text-align: center !important;
            }
            .cpm-backup-btn:hover { background: #e0e0e0 !important; color: #333 !important; }

            #cpm-resize {
                position: absolute !important; bottom: 0 !important; right: 0 !important; width: 10px !important; height: 10px !important; cursor: nwse-resize !important;
            }
            #cpm-resize::before {
                content: '' !important; position: absolute !important; bottom: 2px !important; right: 2px !important; width: 5px !important; height: 5px !important;
                border-right: 1px solid #bbb !important; border-bottom: 1px solid #bbb !important;
            }

            /* VIEW MODES - WIDER CARDS */
            body.cpm-compact a[href^="/project/"] {
                display: block !important;
                padding: 10px 14px !important;
                margin-bottom: 4px !important;
                min-height: unset !important;
                height: auto !important;
                min-width: 180px !important;
            }
            body.cpm-compact [class*="grid"]:has(a[href^="/project/"]) {
                display: grid !important;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
                gap: 8px !important;
            }

            body.cpm-list a[href^="/project/"] { display: flex !important; align-items: center !important; padding: 6px 12px !important; margin-bottom: 2px !important; min-height: unset !important; height: auto !important; border-radius: 6px !important; }
            body.cpm-list [class*="grid"]:has(a[href^="/project/"]) { display: flex !important; flex-direction: column !important; gap: 2px !important; }
            body.cpm-list a[href^="/project/"] [class*="text-text-300"], body.cpm-list a[href^="/project/"] [class*="text-xs"] { display: none !important; }

            body.cpm-mini [class*="grid"]:has(a[href^="/project/"]) { display: grid !important; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important; gap: 6px !important; }
            body.cpm-mini a[href^="/project/"] { padding: 8px 10px !important; min-height: unset !important; height: auto !important; border-radius: 6px !important; display: flex !important; align-items: center !important; }
            body.cpm-mini a[href^="/project/"] > div > div:not(:first-child), body.cpm-mini a[href^="/project/"] [class*="text-text-300"], body.cpm-mini a[href^="/project/"] [class*="text-xs"], body.cpm-mini a[href^="/project/"] [class*="text-sm"], body.cpm-mini a[href^="/project/"] time, body.cpm-mini a[href^="/project/"] span:not(:first-of-type) { display: none !important; }
            body.cpm-mini a[href^="/project/"] > div { width: 100% !important; }
            body.cpm-mini a[href^="/project/"] [class*="font-medium"], body.cpm-mini a[href^="/project/"] > div > div:first-child span { font-size: 11px !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; }
            body.cpm-mini .cpm-star { display: none !important; }

            a[href^="/project/"] { position: relative !important; transition: background 0.2s ease, border 0.2s ease, transform 0.15s ease !important; }
            .cpm-hide { display: none !important; }

            .cpm-match {
                position: relative !important;
                z-index: 1 !important;
                animation: cpm-glow-pulse 1.5s ease-in-out infinite !important;
            }

            .cpm-match::before {
                content: '' !important;
                position: absolute !important;
                top: -3px !important;
                left: -3px !important;
                right: -3px !important;
                bottom: -3px !important;
                border-radius: 10px !important;
                z-index: -1 !important;
                background:
                    linear-gradient(90deg, #7c7cf5 50%, transparent 50%) top / 200% 3px no-repeat,
                    linear-gradient(90deg, transparent 50%, #7c7cf5 50%) bottom / 200% 3px no-repeat,
                    linear-gradient(0deg, #7c7cf5 50%, transparent 50%) left / 3px 200% no-repeat,
                    linear-gradient(0deg, transparent 50%, #7c7cf5 50%) right / 3px 200% no-repeat !important;
                animation: cpm-border-chase 2s linear infinite !important;
            }

            .cpm-fav { order: -1 !important; box-shadow: inset 0 0 0 2px #ffd43b !important; }
            .cpm-fav.cpm-match { box-shadow: inset 0 0 0 2px #ffd43b !important; }

            .cpm-star {
                position: absolute !important; top: 4px !important; right: 4px !important;
                background: none !important; border: none !important; font-size: 12px !important;
                cursor: pointer !important; opacity: 0.3 !important; z-index: 10 !important;
            }
            .cpm-star:hover { opacity: 1 !important; }
            .cpm-star.on { opacity: 1 !important; color: #f59f00 !important; }

            .cpm-num {
                position: absolute !important;
                bottom: 4px !important;
                right: 4px !important;
                background: rgba(0,0,0,0.5) !important;
                color: white !important;
                font-size: 9px !important;
                font-weight: 600 !important;
                padding: 1px 5px !important;
                border-radius: 8px !important;
                z-index: 10 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                line-height: 1.2 !important;
            }

            body.cpm-mini .cpm-num { display: none !important; }

            /* 🎯 TOOLTIP */
            #cpm-tooltip {
                position: fixed !important;
                z-index: 99999999 !important;
                background: #ffffff !important;
                border: 1px solid #e0e0e0 !important;
                padding: 12px 24px !important;
                border-radius: 12px !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                pointer-events: none !important;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
                opacity: 0 !important;
                visibility: hidden !important;
                text-align: center !important;
                min-width: 120px !important;
            }

            #cpm-tooltip.visible {
                opacity: 1 !important;
                visibility: visible !important;
                animation: cpm-tooltip-in 0.2s ease-out !important;
            }

            #cpm-tooltip .tooltip-name {
                font-size: 14px !important;
                font-weight: 600 !important;
                color: #333 !important;
                white-space: nowrap !important;
            }

            #cpm-tooltip .tooltip-date {
                font-size: 11px !important;
                color: #888 !important;
                margin-top: 8px !important;
                padding-top: 8px !important;
                border-top: 1px solid #eee !important;
                white-space: nowrap !important;
            }

            #cpm-tooltip::after {
                content: '' !important;
                position: absolute !important;
                top: 100% !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                border: 8px solid transparent !important;
                border-top-color: #ffffff !important;
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1)) !important;
            }

            /* Card hover effect */
            a[href^="/project/"]:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            }

            /* 🔴 Project title RED when inside project chat */
            body.cpm-inside-project h1 {
                color: #e53935 !important;
            }

            #cpm-menu {
                position: fixed !important; z-index: 9999999 !important; background: #fff !important; border: 1px solid #ddd !important;
                border-radius: 5px !important; padding: 3px 0 !important; min-width: 100px !important; box-shadow: 0 3px 12px rgba(0,0,0,0.1) !important;
                display: none !important; font-size: 9px !important;
            }
            .cpm-menu-item { padding: 4px 7px !important; cursor: pointer !important; color: #333 !important; display: flex !important; align-items: center !important; gap: 5px !important; }
            .cpm-menu-item:hover { background: #f5f5f5 !important; }
            .cpm-menu-sep { height: 1px !important; background: #eee !important; margin: 2px 0 !important; }
            .cpm-menu-colors { display: flex !important; flex-wrap: wrap !important; gap: 3px !important; padding: 4px 7px !important; }
            .cpm-menu-color { width: 16px !important; height: 16px !important; border-radius: 3px !important; cursor: pointer !important; border: 2px solid transparent !important; }
            .cpm-menu-color:hover { transform: scale(1.1) !important; border-color: #333 !important; }
            .cpm-menu-color[data-c="none"] { background: #98d8aa !important; }
            .cpm-menu-color[data-c="red"] { background: #ff6b6b !important; }
            .cpm-menu-color[data-c="orange"] { background: #ffa94d !important; }
            .cpm-menu-color[data-c="yellow"] { background: #ffd43b !important; }
            .cpm-menu-color[data-c="green"] { background: #51cf66 !important; }
            .cpm-menu-color[data-c="blue"] { background: #4dabf7 !important; }
            .cpm-menu-color[data-c="purple"] { background: #be4bdb !important; }
            .cpm-menu-color[data-c="pink"] { background: #f783ac !important; }

            /* 🔴 PROJECT HEADER COLOR INDICATOR */
            .cpm-project-indicator {
                display: inline-block !important;
                width: 10px !important;
                height: 10px !important;
                border-radius: 50% !important;
                margin-right: 8px !important;
                vertical-align: middle !important;
                box-shadow: 0 0 4px rgba(0,0,0,0.3) !important;
            }
        `;
        document.head.appendChild(style);
        log('Styles injected');
    }

    // ============================================
    // 🎯 GLOBAL TOOLTIP SYSTEM
    // ============================================
    let tooltipEl = null;
    let tooltipTimeout = null;

    function createTooltip() {
        const old = document.getElementById('cpm-tooltip');
        if (old) old.remove();

        tooltipEl = document.createElement('div');
        tooltipEl.id = 'cpm-tooltip';
        tooltipEl.innerHTML = `
            <div class="tooltip-name"></div>
            <div class="tooltip-date"></div>
        `;
        document.body.appendChild(tooltipEl);
        log('Tooltip created');
    }

    function showTooltip(name, date, cardRect) {
        if (!tooltipEl || !name) return;

        tooltipEl.querySelector('.tooltip-name').textContent = name;

        const dateEl = tooltipEl.querySelector('.tooltip-date');
        if (date) {
            dateEl.textContent = date;
            dateEl.style.display = 'block';
        } else {
            dateEl.style.display = 'none';
        }

        tooltipEl.classList.add('visible');

        const tooltipRect = tooltipEl.getBoundingClientRect();
        let left = cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2);
        let top = cardRect.top - tooltipRect.height - 12;

        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = cardRect.bottom + 12;
        }

        tooltipEl.style.left = left + 'px';
        tooltipEl.style.top = top + 'px';
    }

    function hideTooltip() {
        clearTimeout(tooltipTimeout);
        if (tooltipEl) {
            tooltipEl.classList.remove('visible');
        }
    }

    // 🖼️ PANEL
    function createPanel() {
        log('Creating panel...');
        const old = document.getElementById('cpm-panel');
        if (old) {
            log('Removing old panel');
            old.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'cpm-panel';

        // Calculate safe position
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const panelWidth = settings.panelMinimized ? 40 : settings.panelWidth;

        let posX = settings.panelX;
        let posY = settings.panelY;

        // If no saved position or position is invalid, use default
        if (posX === null || posX < 0 || posX > viewportWidth - 30) {
            posX = viewportWidth - panelWidth - 20;
        }
        if (posY === null || posY < 0 || posY > viewportHeight - 30) {
            posY = 12;
        }

        panel.style.left = posX + 'px';
        panel.style.top = posY + 'px';

        if (!settings.panelMinimized) {
            panel.style.width = settings.panelWidth + 'px';
            panel.style.height = settings.panelHeight + 'px';
        }
        if (settings.panelMinimized) panel.classList.add('minimized');

        panel.innerHTML = `
            <div id="cpm-header">
                <span class="toggle-icon">${settings.panelMinimized ? '+' : '−'}</span>
            </div>
            <div id="cpm-body">
                <div>
                    <div class="cpm-sec-title">View</div>
                    <div class="cpm-view-row">
                        <button class="cpm-vbtn" data-view="cards" title="Cards view">🃏</button>
                        <button class="cpm-vbtn" data-view="compact" title="Compact view">📋</button>
                        <button class="cpm-vbtn" data-view="list" title="List view">📝</button>
                        <button class="cpm-vbtn" data-view="mini" title="Mini view">🔳</button>
                    </div>
                </div>
                <div>
                    <div class="cpm-sec-title">Search</div>
                    <input type="text" id="cpm-search" placeholder="Filter projects...">
                </div>
                <div>
                    <div class="cpm-sec-title">Stats</div>
                    <div class="cpm-stats">
                        <div><div class="cpm-stat-num" id="s-total">0</div><div class="cpm-stat-lbl">Total</div></div>
                        <div><div class="cpm-stat-num" id="s-favs">0</div><div class="cpm-stat-lbl">Favs</div></div>
                        <div><div class="cpm-stat-num" id="s-shown">0</div><div class="cpm-stat-lbl">Shown</div></div>
                    </div>
                </div>
                <div>
                    <button class="cpm-backup-btn" id="btn-backup">💾 Backup Settings</button>
                </div>
            </div>
            <div id="cpm-resize"></div>
        `;

        document.body.appendChild(panel);
        panelCreated = true;
        log('Panel created at', posX, posY, 'minimized:', settings.panelMinimized);

        setupPanelInteractions(panel);
        updateViewButtons();

        return panel;
    }

    function updateToggleIcon(panel) {
        const icon = panel.querySelector('.toggle-icon');
        if (icon) {
            icon.textContent = settings.panelMinimized ? '+' : '−';
        }
    }

    function setupPanelInteractions(panel) {
        const header = panel.querySelector('#cpm-header');
        const btnBackup = panel.querySelector('#btn-backup');
        const search = panel.querySelector('#cpm-search');
        const resize = panel.querySelector('#cpm-resize');

        // HEADER: Click to toggle, drag to move
        let mouseDownX = 0;
        let mouseDownY = 0;
        let isDragging = false;
        let hasMoved = false;

        header.addEventListener('mousedown', e => {
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            isDragging = true;
            hasMoved = false;
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!isDragging) return;

            const dx = e.clientX - mouseDownX;
            const dy = e.clientY - mouseDownY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasMoved = true;
                const newX = panel.offsetLeft + dx;
                const newY = panel.offsetTop + dy;
                panel.style.left = Math.max(0, Math.min(window.innerWidth - 30, newX)) + 'px';
                panel.style.top = Math.max(0, Math.min(window.innerHeight - 30, newY)) + 'px';
                mouseDownX = e.clientX;
                mouseDownY = e.clientY;
            }
        });

        document.addEventListener('mouseup', e => {
            if (!isDragging) return;
            isDragging = false;

            if (hasMoved) {
                settings.panelX = panel.offsetLeft;
                settings.panelY = panel.offsetTop;
                saveSettings();
                log('Panel position saved:', settings.panelX, settings.panelY);
            } else {
                toggleMinimize(panel);
            }
        });

        // RESIZE SYSTEM
        let resizing = false;
        let resizeStartX, resizeStartY, resizeStartW, resizeStartH;

        resize.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
            resizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            resizeStartW = panel.offsetWidth;
            resizeStartH = panel.offsetHeight;
            document.body.style.cursor = 'nwse-resize';
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', e => {
            if (!resizing) return;
            panel.style.width = Math.max(100, Math.min(250, resizeStartW + e.clientX - resizeStartX)) + 'px';
            panel.style.height = Math.max(100, Math.min(350, resizeStartH + e.clientY - resizeStartY)) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (resizing) {
                resizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                settings.panelWidth = panel.offsetWidth;
                settings.panelHeight = panel.offsetHeight;
                saveSettings();
            }
        });

        // OTHER BUTTONS
        btnBackup.addEventListener('click', e => {
            e.stopPropagation();
            showBackupSettings();
        });

        panel.querySelectorAll('.cpm-vbtn').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                setViewMode(btn.dataset.view);
            });
        });

        search.addEventListener('input', () => filterProjects(search.value));
        search.addEventListener('mousedown', e => e.stopPropagation());

        // KEYBOARD SHORTCUTS
        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 'f') {
                if (isProjectsPage()) {
                    e.preventDefault();
                    search.focus();
                }
            }
            if (e.key === 'Escape' && document.activeElement === search) {
                search.value = '';
                filterProjects('');
                search.blur();
            }
            if (!e.ctrlKey && !e.altKey && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
                if (isProjectsPage()) {
                    if (e.key === '1') setViewMode('cards');
                    if (e.key === '2') setViewMode('compact');
                    if (e.key === '3') setViewMode('list');
                    if (e.key === '4') setViewMode('mini');
                }
            }
        });
    }

    function toggleMinimize(panel) {
        panel.classList.toggle('minimized');
        settings.panelMinimized = panel.classList.contains('minimized');
        updateToggleIcon(panel);
        if (!settings.panelMinimized) {
            panel.style.width = settings.panelWidth + 'px';
            panel.style.height = settings.panelHeight + 'px';
        }
        saveSettings();
        log('Panel minimized:', settings.panelMinimized);
    }

    function setViewMode(mode) {
        document.body.classList.remove('cpm-cards', 'cpm-compact', 'cpm-list', 'cpm-mini');
        if (mode !== 'cards') document.body.classList.add('cpm-' + mode);
        settings.viewMode = mode;
        saveSettings();
        updateViewButtons();
        log('View mode set to:', mode);
    }

    function updateViewButtons() {
        document.querySelectorAll('.cpm-vbtn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === settings.viewMode);
        });
    }

    function filterProjects(q) {
        const cards = getProjectCards();
        const query = q.toLowerCase().trim();
        let shown = 0;
        cards.forEach(card => {
            const match = !query || card.textContent.toLowerCase().includes(query);
            card.classList.toggle('cpm-hide', !match);
            card.classList.toggle('cpm-match', match && query);
            if (match) shown++;
        });
        updateStats(cards.length, favorites.length, shown);
    }

    const COLOR_IDS = ['none','red','orange','yellow','green','blue','purple','pink'];

    function toggleFavorite(id) {
        const i = favorites.indexOf(id);
        if (i === -1) favorites.push(id); else favorites.splice(i, 1);
        saveFavorites();
        enhanceCards();
    }

    function setColor(id, colorId) {
        if (colorId === 'none') delete projectColors[id]; else projectColors[id] = colorId;
        saveColors();
        enhanceCards();
    }

    function createContextMenu() {
        const old = document.getElementById('cpm-menu');
        if (old) old.remove();

        const menu = document.createElement('div');
        menu.id = 'cpm-menu';
        menu.innerHTML = `
            <div class="cpm-menu-item" data-act="fav"><span>⭐</span><span id="menu-fav-txt">Fav</span></div>
            <div class="cpm-menu-sep"></div>
            <div class="cpm-menu-colors">${COLOR_IDS.map(c => `<div class="cpm-menu-color" data-c="${c}"></div>`).join('')}</div>
            <div class="cpm-menu-sep"></div>
            <div class="cpm-menu-item" data-act="newtab"><span>🔗</span><span>New Tab</span></div>
        `;
        document.body.appendChild(menu);
        document.addEventListener('click', e => { if (!e.target.closest('#cpm-menu')) menu.style.display = 'none'; });
        menu.addEventListener('click', e => {
            const colorDot = e.target.closest('.cpm-menu-color');
            const item = e.target.closest('.cpm-menu-item');
            if (colorDot) { setColor(menu.dataset.pid, colorDot.dataset.c); menu.style.display = 'none'; }
            else if (item?.dataset.act) {
                if (item.dataset.act === 'fav') toggleFavorite(menu.dataset.pid);
                else if (item.dataset.act === 'newtab' && menu.dataset.href) window.open(menu.dataset.href, '_blank');
                menu.style.display = 'none';
            }
        });
        log('Context menu created');
    }

    function showMenu(e, card, pid) {
        e.preventDefault();
        const menu = document.getElementById('cpm-menu');
        if (!menu) return;
        menu.dataset.pid = pid;
        menu.dataset.href = card.href || '';
        const favTxt = document.getElementById('menu-fav-txt');
        if (favTxt) favTxt.textContent = favorites.includes(pid) ? 'Unfav' : 'Fav';
        menu.style.left = Math.min(e.pageX, window.innerWidth - 120) + 'px';
        menu.style.top = Math.min(e.pageY, window.innerHeight - 150) + 'px';
        menu.style.display = 'block';
    }

    function getProjectCards() { return Array.from(document.querySelectorAll('a[href^="/project/"]')); }

    function getProjectId(card) {
        const m = (card.href || '').match(/\/project\/([^/?#]+)/);
        return m ? m[1] : card.textContent.trim().substring(0, 30);
    }

    function getProjectName(card) {
        const titleEl = card.querySelector('[class*="font-medium"]');
        if (titleEl) {
            let text = titleEl.textContent.trim();
            text = text.replace(/Updated\s+\d+\s+\w+\s+ago/gi, '').trim();
            text = text.replace(/\d+\s+(day|days|hour|hours|minute|minutes|month|months|year|years)\s+ago/gi, '').trim();
            text = text.replace(/[☆★]\d*$/, '').trim();
            if (text) return text;
        }

        const spans = card.querySelectorAll('span');
        for (const span of spans) {
            if (span.classList.contains('cpm-star') || span.classList.contains('cpm-num')) continue;

            let text = span.textContent.trim();

            if (text.match(/\d+\s+(day|days|hour|hours|minute|minutes|month|months|year|years)\s+ago/i)) continue;
            if (text.match(/^Updated/i)) continue;

            text = text.replace(/Updated\s+\d+\s+\w+\s+ago/gi, '').trim();
            text = text.replace(/\d+\s+(day|days|hour|hours|minute|minutes|month|months|year|years)\s+ago/gi, '').trim();
            text = text.replace(/[☆★]\d*$/, '').trim();

            if (text && text.length > 1) return text;
        }

        let fullText = card.textContent;
        fullText = fullText.replace(/Updated\s+\d+\s+\w+\s+ago/gi, '');
        fullText = fullText.replace(/\d+\s+(day|days|hour|hours|minute|minutes|month|months|year|years)\s+ago/gi, '');
        fullText = fullText.replace(/[☆★]\d*/g, '');

        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l && l.length > 1);
        return lines[0] || 'Project';
    }

    function getProjectDate(card) {
        const timeEl = card.querySelector('time');
        if (timeEl) {
            return 'Updated ' + timeEl.textContent.trim();
        }

        const allText = card.textContent;
        const agoMatch = allText.match(/(\d+\s+\w+\s+ago)/i);
        if (agoMatch) {
            return 'Updated ' + agoMatch[1];
        }

        return '';
    }

    function updateStats(total, favs, shown) {
        const cards = getProjectCards();
        const t = document.getElementById('s-total');
        const f = document.getElementById('s-favs');
        const s = document.getElementById('s-shown');
        if (t) t.textContent = total ?? cards.length;
        if (f) f.textContent = favs ?? favorites.length;
        if (s) s.textContent = shown ?? cards.filter(c => !c.classList.contains('cpm-hide')).length;
    }

    function enhanceCards() {
        const cards = getProjectCards();
        log('Enhancing', cards.length, 'cards');

        cards.forEach((card, index) => {
            const pid = getProjectId(card);
            const isFav = favorites.includes(pid);
            const manualColor = projectColors[pid];
            card.classList.toggle('cpm-fav', isFav);

            let colorInfo = manualColor && manualColor !== 'none'
                ? MANUAL_COLORS.find(c => c.id === manualColor)
                : DEFAULT_COLOR;

            if (colorInfo) {
                card.style.borderLeft = `5px solid ${colorInfo.border}`;
                card.style.background = colorInfo.bg;
            }

            // Star button
            let star = card.querySelector('.cpm-star');
            if (!star) {
                star = document.createElement('button');
                star.className = 'cpm-star';
                star.type = 'button';
                star.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleFavorite(pid); });
                card.appendChild(star);
            }
            star.textContent = isFav ? '★' : '☆';
            star.classList.toggle('on', isFav);

            // Number badge
            let numBadge = card.querySelector('.cpm-num');
            if (!numBadge) {
                numBadge = document.createElement('span');
                numBadge.className = 'cpm-num';
                card.appendChild(numBadge);
            }
            numBadge.textContent = index + 1;

            // Hover tooltip events
            if (!card.dataset.cpmHover) {
                card.dataset.cpmHover = '1';
                const projectName = getProjectName(card);
                const projectDate = getProjectDate(card);
                card.dataset.cpmName = projectName;
                card.dataset.cpmDate = projectDate;

                card.addEventListener('mouseenter', () => {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = setTimeout(() => {
                        const rect = card.getBoundingClientRect();
                        showTooltip(card.dataset.cpmName, card.dataset.cpmDate, rect);
                    }, 300);
                });

                card.addEventListener('mouseleave', () => {
                    hideTooltip();
                });

                card.addEventListener('click', () => {
                    hideTooltip();
                });
            }

            // Context menu
            if (!card.dataset.cpmMenu) {
                card.dataset.cpmMenu = '1';
                card.addEventListener('contextmenu', e => showMenu(e, card, pid));
            }
        });
        updateStats();
    }

    // ============================================
    // 🎯 PAGE DETECTION - IMPROVED
    // ============================================

    function isProjectsPage() {
        const path = location.pathname;
        // Match /projects or /projects/ or URLs with project cards visible
        const isPath = path === '/projects' || path === '/projects/';
        const hasCards = document.querySelectorAll('a[href^="/project/"]').length > 0;

        // Also check if we're on main page with projects visible
        const isMainWithProjects = path === '/' && hasCards;

        return isPath || isMainWithProjects;
    }

    function isInsideProject() {
        const path = location.pathname;
        // Inside a specific project (e.g., /project/abc-123 or /project/abc-123/chat/xyz)
        return path.match(/^\/project\/[^/]+/) !== null;
    }

    function getProjectIdFromUrl() {
        const match = location.pathname.match(/^\/project\/([^/?#/]+)/);
        return match ? match[1] : null;
    }

    // 🔴 Apply color indicator to project header
    function applyProjectHeaderColor() {
        const projectId = getProjectIdFromUrl();
        if (!projectId) return;

        // Remove any existing indicators first
        document.querySelectorAll('.cpm-project-indicator').forEach(el => el.remove());

        // Find the project name element
        let targetElement = null;

        // Method 1: Look for h1 elements
        const h1Elements = document.querySelectorAll('h1');
        for (const h1 of h1Elements) {
            if (h1.textContent.trim().length > 0 && !h1.querySelector('.cpm-project-indicator')) {
                targetElement = h1;
                break;
            }
        }

        // Method 2: Look for project link in breadcrumb
        if (!targetElement) {
            const projectLinks = document.querySelectorAll('a[href^="/project/"]');
            for (const link of projectLinks) {
                const rect = link.getBoundingClientRect();
                if (rect.top < 100 && rect.top > 0) {
                    targetElement = link;
                    break;
                }
            }
        }

        if (!targetElement) return;

        // Get the color for this project
        const manualColor = projectColors[projectId];
        let colorInfo = manualColor && manualColor !== 'none'
            ? MANUAL_COLORS.find(c => c.id === manualColor)
            : DEFAULT_COLOR;

        // Create the color indicator dot
        const indicator = document.createElement('span');
        indicator.className = 'cpm-project-indicator';
        indicator.style.backgroundColor = colorInfo.border;
        indicator.title = 'Project color';

        // Insert at the beginning of the element
        targetElement.insertBefore(indicator, targetElement.firstChild);
        log('Applied header color indicator for project:', projectId);
    }

    function cleanup() {
        hideTooltip();
        document.body.classList.remove('cpm-cards', 'cpm-compact', 'cpm-list', 'cpm-mini', 'cpm-inside-project');

        const panel = document.getElementById('cpm-panel');
        if (panel) {
            panel.classList.add('cpm-hidden');
        }
        log('Cleanup done');
    }

    function showUI() {
        log('showUI called');
        let panel = document.getElementById('cpm-panel');

        if (!panel) {
            panel = createPanel();
        } else {
            panel.classList.remove('cpm-hidden');
            log('Panel shown (removed cpm-hidden)');
        }

        setViewMode(settings.viewMode);
        setTimeout(enhanceCards, 100);
        setTimeout(enhanceCards, 500); // Double-check after content loads
    }

    // Hide tooltip on any click
    document.addEventListener('click', () => {
        hideTooltip();
    });

    // ============================================
    // 🎯 SPA NAVIGATION DETECTION
    // ============================================

    function checkPage() {
        const currentUrl = location.href;

        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            log('URL changed to:', location.pathname);

            if (isProjectsPage()) {
                log('On projects page - showing UI');
                document.body.classList.remove('cpm-inside-project');
                showUI();
            } else if (isInsideProject()) {
                log('Inside project - showing color indicator');
                cleanup();
                document.body.classList.add('cpm-inside-project');
                setTimeout(applyProjectHeaderColor, 300);
                setTimeout(applyProjectHeaderColor, 1000); // Retry for slow loads
            } else {
                log('Other page - hiding UI');
                cleanup();
            }
        }
    }

    // Watch for URL changes using multiple methods

    // Method 1: popstate for back/forward
    window.addEventListener('popstate', () => {
        setTimeout(checkPage, 100);
    });

    // Method 2: MutationObserver for SPA navigation
    const observer = new MutationObserver(() => {
        checkPage();

        // Also enhance cards if on projects page
        if (isProjectsPage()) {
            const cards = getProjectCards();
            if (cards.length > 0 && cards.some(c => !c.dataset.cpmMenu)) {
                enhanceCards();
            }
        }

        // Apply header color inside project if not already present
        if (isInsideProject() && !document.querySelector('.cpm-project-indicator')) {
            applyProjectHeaderColor();
        }
    });

    // Method 3: Periodic check as backup
    setInterval(checkPage, 1000);

    // ============================================
    // 🚀 INIT
    // ============================================

    function init() {
        log('Initializing...');
        loadSettings();
        injectStyles();
        createTooltip();
        createContextMenu();

        lastUrl = location.href;

        if (isProjectsPage()) {
            log('Starting on projects page');
            createPanel();
            setViewMode(settings.viewMode);
            checkAutoBackup();
            setTimeout(enhanceCards, 500);
            setTimeout(enhanceCards, 1500); // Extra delay for slow loads
        } else if (isInsideProject()) {
            log('Starting inside project');
            document.body.classList.add('cpm-inside-project');
            setTimeout(applyProjectHeaderColor, 500);
        } else {
            log('Starting on other page:', location.pathname);
        }

        // Start observing
        observer.observe(document.body, { childList: true, subtree: true });

        isInitialized = true;
        log('Initialization complete');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 100);
        });
    } else {
        setTimeout(init, 100);
    }

})();