// ==UserScript==
// @name         Claude Projects Manager (v2)
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Organize your Claude.ai Projects with view modes, favorites, colors, search, tooltips & backup!
// @author       Solomon
// @match        https://claude.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/564095/Claude%20Projects%20Manager%20%28v2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564095/Claude%20Projects%20Manager%20%28v2%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // 🎯 CLAUDE PROJECTS MANAGER v2
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
    // - 🔴 Project header color indicator (v3)
    // ============================================

    let settings = {
        viewMode: 'compact',
        panelMinimized: true,
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

    // 💾 STORAGE
    function loadSettings() {
        try {
            const saved = GM_getValue('cpm_v36_settings', null);
            if (saved) settings = { ...settings, ...JSON.parse(saved) };
            favorites = JSON.parse(GM_getValue('cpm_v36_favs', '[]'));
            projectColors = JSON.parse(GM_getValue('cpm_v36_colors', '{}'));
        } catch (e) {}
    }

    function saveSettings() { GM_setValue('cpm_v36_settings', JSON.stringify(settings)); }
    function saveFavorites() { GM_setValue('cpm_v36_favs', JSON.stringify(favorites)); }
    function saveColors() { GM_setValue('cpm_v36_colors', JSON.stringify(projectColors)); }

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
            version: 7,
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
        console.log('📁 CPM: Auto backup for ' + currentKey);
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
                position: fixed;
                z-index: 999999;
                background: #f8f8fa !important;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #333;
                user-select: none;
                overflow: visible;
                font-size: 9px;
            }

            #cpm-panel.minimized #cpm-body, #cpm-panel.minimized #cpm-resize { display: none; }
            #cpm-panel.minimized { width: auto !important; height: auto !important; }

            #cpm-header {
                background: linear-gradient(135deg, #7c7cf5, #a78bfa);
                padding: 4px 8px;
                border-radius: 5px 5px 0 0;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                min-width: 24px;
                min-height: 18px;
            }
            
            #cpm-panel.minimized #cpm-header { border-radius: 5px; }
            
            #cpm-header:hover {
                background: linear-gradient(135deg, #6b6be0, #9678e8);
            }

            #cpm-header .toggle-icon {
                color: white;
                font-size: 14px;
                font-weight: bold;
                line-height: 1;
            }

            #cpm-body {
                padding: 5px;
                display: flex;
                flex-direction: column;
                gap: 5px;
                overflow-y: auto;
                background: #f8f8fa !important;
                height: calc(100% - 26px);
                box-sizing: border-box;
            }

            .cpm-sec-title { font-size: 7px; text-transform: uppercase; letter-spacing: 0.3px; color: #888; margin-bottom: 2px; font-weight: 600; }
            .cpm-view-row { display: flex; gap: 2px; }

            .cpm-vbtn {
                flex: 1;
                background: #eee;
                border: 1px solid transparent;
                padding: 3px 2px;
                border-radius: 3px;
                color: #666;
                cursor: pointer;
                text-align: center;
                font-size: 9px;
                line-height: 1;
            }
            .cpm-vbtn:hover { background: #e0e0e0; color: #333; }
            .cpm-vbtn.active { background: #7c7cf5; border-color: #a78bfa; color: white; }

            #cpm-search {
                width: 100%;
                padding: 4px 5px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 3px;
                color: #333;
                font-size: 9px;
                box-sizing: border-box;
            }
            #cpm-search:focus { outline: none; border-color: #7c7cf5; }

            .cpm-stats { display: flex; justify-content: space-around; text-align: center; padding: 2px 0; }
            .cpm-stat-num { font-size: 12px; font-weight: bold; color: #7c7cf5; }
            .cpm-stat-lbl { font-size: 6px; color: #999; text-transform: uppercase; }

            .cpm-backup-btn {
                width: 100%;
                padding: 4px;
                background: #eee;
                border: 1px solid #ddd;
                border-radius: 3px;
                color: #666;
                cursor: pointer;
                font-size: 8px;
                text-align: center;
            }
            .cpm-backup-btn:hover { background: #e0e0e0; color: #333; }

            #cpm-resize {
                position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize;
            }
            #cpm-resize::before {
                content: ''; position: absolute; bottom: 2px; right: 2px; width: 5px; height: 5px;
                border-right: 1px solid #bbb; border-bottom: 1px solid #bbb;
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
                position: fixed;
                z-index: 99999999;
                background: #ffffff;
                border: 1px solid #e0e0e0;
                padding: 12px 24px;
                border-radius: 12px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                pointer-events: none;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                opacity: 0;
                visibility: hidden;
                text-align: center;
                min-width: 120px;
            }
            
            #cpm-tooltip.visible {
                opacity: 1;
                visibility: visible;
                animation: cpm-tooltip-in 0.2s ease-out;
            }
            
            #cpm-tooltip .tooltip-name {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                white-space: nowrap;
            }
            
            #cpm-tooltip .tooltip-date {
                font-size: 11px;
                color: #888;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #eee;
                white-space: nowrap;
            }
            
            #cpm-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 8px solid transparent;
                border-top-color: #ffffff;
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
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
                position: fixed; z-index: 9999999; background: #fff; border: 1px solid #ddd;
                border-radius: 5px; padding: 3px 0; min-width: 100px; box-shadow: 0 3px 12px rgba(0,0,0,0.1);
                display: none; font-size: 9px;
            }
            .cpm-menu-item { padding: 4px 7px; cursor: pointer; color: #333; display: flex; align-items: center; gap: 5px; }
            .cpm-menu-item:hover { background: #f5f5f5; }
            .cpm-menu-sep { height: 1px; background: #eee; margin: 2px 0; }
            .cpm-menu-colors { display: flex; flex-wrap: wrap; gap: 3px; padding: 4px 7px; }
            .cpm-menu-color { width: 16px; height: 16px; border-radius: 3px; cursor: pointer; border: 2px solid transparent; }
            .cpm-menu-color:hover { transform: scale(1.1); border-color: #333; }
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
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-right: 8px;
                vertical-align: middle;
                box-shadow: 0 0 4px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // 🎯 GLOBAL TOOLTIP SYSTEM
    // ============================================
    let tooltipEl = null;
    let tooltipTimeout = null;
    
    function createTooltip() {
        // Remove old tooltip first
        const old = document.getElementById('cpm-tooltip');
        if (old) old.remove();
        
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'cpm-tooltip';
        tooltipEl.innerHTML = `
            <div class="tooltip-name"></div>
            <div class="tooltip-date"></div>
        `;
        document.body.appendChild(tooltipEl);
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
        const old = document.getElementById('cpm-panel');
        if (old) old.remove();

        const panel = document.createElement('div');
        panel.id = 'cpm-panel';
        
        const defaultX = window.innerWidth - 160;
        panel.style.left = (settings.panelX !== null ? settings.panelX : defaultX) + 'px';
        panel.style.top = settings.panelY + 'px';
        
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
                        <button class="cpm-vbtn" data-view="cards">🃏</button>
                        <button class="cpm-vbtn" data-view="compact">📋</button>
                        <button class="cpm-vbtn" data-view="list">📝</button>
                        <button class="cpm-vbtn" data-view="mini">🔳</button>
                    </div>
                </div>
                <div>
                    <div class="cpm-sec-title">Search</div>
                    <input type="text" id="cpm-search" placeholder="Filter...">
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
        setupPanelInteractions(panel);
        updateViewButtons();
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
        
        // HEADER: Click to toggle, drag to move - SMOOTH VERSION
        let mouseDownX = 0;
        let mouseDownY = 0;
        let isDragging = false;
        let hasMoved = false;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let animationFrame = null;
        
        // Smooth animation using lerp (linear interpolation)
        function smoothMove() {
            if (!isDragging && Math.abs(currentX - targetX) < 0.5 && Math.abs(currentY - targetY) < 0.5) {
                currentX = targetX;
                currentY = targetY;
                panel.style.left = currentX + 'px';
                panel.style.top = currentY + 'px';
                animationFrame = null;
                return;
            }
            
            // Lerp factor - higher = snappier, lower = smoother (0.15-0.3 is nice)
            const lerp = 0.25;
            currentX += (targetX - currentX) * lerp;
            currentY += (targetY - currentY) * lerp;
            
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
            
            animationFrame = requestAnimationFrame(smoothMove);
        }
        
        header.addEventListener('mousedown', e => {
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            currentX = panel.offsetLeft;
            currentY = panel.offsetTop;
            targetX = currentX;
            targetY = currentY;
            isDragging = true;
            hasMoved = false;
            panel.style.transition = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            
            const dx = e.clientX - mouseDownX;
            const dy = e.clientY - mouseDownY;
            
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                hasMoved = true;
                targetX = Math.max(0, Math.min(window.innerWidth - 30, panel.offsetLeft + (e.clientX - mouseDownX)));
                targetY = Math.max(0, Math.min(window.innerHeight - 30, panel.offsetTop + (e.clientY - mouseDownY)));
                mouseDownX = e.clientX;
                mouseDownY = e.clientY;
                
                if (!animationFrame) {
                    animationFrame = requestAnimationFrame(smoothMove);
                }
            }
        });
        
        document.addEventListener('mouseup', e => {
            if (!isDragging) return;
            isDragging = false;
            
            if (hasMoved) {
                // Let animation finish smoothly
                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                    animationFrame = requestAnimationFrame(smoothMove);
                }
                settings.panelX = Math.round(targetX);
                settings.panelY = Math.round(targetY);
                saveSettings();
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
                e.preventDefault();
                search.focus();
            }
            if (e.key === 'Escape' && document.activeElement === search) {
                search.value = '';
                filterProjects('');
                search.blur();
            }
            if (!e.ctrlKey && !e.altKey && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
                if (e.key === '1') setViewMode('cards');
                if (e.key === '2') setViewMode('compact');
                if (e.key === '3') setViewMode('list');
                if (e.key === '4') setViewMode('mini');
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
    }

    function setViewMode(mode) {
        document.body.classList.remove('cpm-cards', 'cpm-compact', 'cpm-list', 'cpm-mini');
        if (mode !== 'cards') document.body.classList.add('cpm-' + mode);
        settings.viewMode = mode;
        saveSettings();
        updateViewButtons();
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
    // 🎯 CLEANUP & PAGE DETECTION
    // ============================================
    
    function isProjectsPage() {
        return location.pathname === '/projects' || location.pathname.startsWith('/projects');
    }
    
    function isInsideProject() {
        // Inside a specific project (e.g., /project/abc-123)
        return location.pathname.startsWith('/project/') && !location.pathname.endsWith('/projects');
    }
    
    function getProjectIdFromUrl() {
        const match = location.pathname.match(/^\/project\/([^/?#]+)/);
        return match ? match[1] : null;
    }
    
    // 🔴 Apply color indicator to project header - WITH RETRY
    let headerRetryCount = 0;
    const MAX_HEADER_RETRIES = 20;
    
    function applyProjectHeaderColor() {
        const projectId = getProjectIdFromUrl();
        if (!projectId) {
            return;
        }
        
        // Check if indicator already exists
        if (document.querySelector('.cpm-project-indicator')) {
            headerRetryCount = 0;
            return;
        }
        
        // ONLY look for links that actually point to /project/
        // This is the breadcrumb link to the project
        let targetElement = null;
        
        // Get all links that contain /project/ in href
        const projectLinks = document.querySelectorAll('a[href*="/project/"]');
        
        for (const link of projectLinks) {
            const rect = link.getBoundingClientRect();
            // Must be in header area (top 80px) and visible
            if (rect.top >= 0 && rect.top < 80 && rect.width > 0 && rect.height > 0) {
                // This should be the breadcrumb project link
                targetElement = link;
                console.log('📁 CPM: Found project link in header:', link.textContent.trim(), 'at top:', rect.top);
                break;
            }
        }
        
        if (!targetElement) {
            // Retry if not found yet
            headerRetryCount++;
            if (headerRetryCount < MAX_HEADER_RETRIES) {
                console.log('📁 CPM: Project header link not found, retry', headerRetryCount, '/', MAX_HEADER_RETRIES);
                setTimeout(applyProjectHeaderColor, 250);
            } else {
                console.log('📁 CPM: Could not find project header after', MAX_HEADER_RETRIES, 'attempts');
                headerRetryCount = 0;
            }
            return;
        }
        
        headerRetryCount = 0;
        
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
        
        // Insert at the beginning of the link
        targetElement.insertBefore(indicator, targetElement.firstChild);
        console.log('📁 CPM: ✅ Color indicator added!');
    }
    
    function cleanup() {
        hideTooltip();
        document.body.classList.remove('cpm-cards', 'cpm-compact', 'cpm-list', 'cpm-mini', 'cpm-inside-project');
        
        const panel = document.getElementById('cpm-panel');
        if (panel) panel.style.display = 'none';
    }
    
    function showUI() {
        const panel = document.getElementById('cpm-panel');
        if (panel) {
            panel.style.display = '';
        } else {
            createPanel();
        }
        setViewMode(settings.viewMode);
        setTimeout(enhanceCards, 100);
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
            
            if (isProjectsPage()) {
                console.log('📁 CPM: On projects page - showing UI');
                document.body.classList.remove('cpm-inside-project');
                showUI();
            } else if (isInsideProject()) {
                console.log('📁 CPM: Inside project - showing color indicator');
                document.body.classList.add('cpm-inside-project');
                cleanup();
                document.body.classList.add('cpm-inside-project');
                // Apply project header color after a short delay for DOM to load
                setTimeout(applyProjectHeaderColor, 300);
            } else {
                console.log('📁 CPM: Other page - hiding UI');
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
    setInterval(checkPage, 500);

    // ============================================
    // 🚀 INIT
    // ============================================
    
    function init() {
        loadSettings();
        injectStyles();
        createTooltip();
        createContextMenu();
        
        lastUrl = location.href;
        
        if (isProjectsPage()) {
            createPanel();
            setViewMode(settings.viewMode);
            checkAutoBackup();
            setTimeout(enhanceCards, 500);
        }
        
        // Start observing
        observer.observe(document.body, { childList: true, subtree: true });
        
        isInitialized = true;
        console.log('📁 CPM v2: Initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();