// ==UserScript==
// @name         🎨 Graffiti Spray
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  Minimal graffiti spraying tool for Popmundo
// @match        https://*.popmundo.com/World/Popmundo.aspx/City/Locales/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562920/%F0%9F%8E%A8%20Graffiti%20Spray.user.js
// @updateURL https://update.greasyfork.org/scripts/562920/%F0%9F%8E%A8%20Graffiti%20Spray.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIG ===
    const CONFIG = {
        COOLDOWN_SECONDS: 210, // 3.5 minutes
        DELAY_BETWEEN_CHECKS: 1500,
        DELAY_BETWEEN_LOCALES: 1000,
        DELAY_BEFORE_SPRAY: 2000,
        DELAY_AFTER_SPRAY: 1500
    };

    // === STORAGE ===
    const storageKey = "graffiti_visited_v4";
    
    const getVisited = () => {
        try {
            if (typeof GM_getValue !== 'undefined') {
                const stored = GM_getValue(storageKey, "[]");
                return JSON.parse(stored || "[]");
            }
            return JSON.parse(localStorage.getItem(storageKey) || "[]");
        } catch (e) {
            console.warn("Storage read failed:", e);
            return [];
        }
    };
    
    const saveVisited = (data) => {
        try {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(storageKey, JSON.stringify(data));
            } else {
                localStorage.setItem(storageKey, JSON.stringify(data));
            }
        } catch (e) {
            console.warn("Storage write failed:", e);
        }
    };

    // === STATE ===
    let visited = getVisited();
    let timers = [];
    let isRunning = false;
    let isPaused = false;
    let cooldownEndTime = 0;
    let localeLinks = [];
    let currentLocaleIndex = 0;

    const clearTimers = () => {
        timers.forEach(t => clearTimeout(t));
        timers = [];
    };

    const isLocked = () => {
        return Date.now() < cooldownEndTime;
    };

    const lock = (seconds = CONFIG.COOLDOWN_SECONDS) => {
        cooldownEndTime = Date.now() + (seconds * 1000);
    };

    const unlock = () => {
        cooldownEndTime = 0;
    };

    // === UI STYLES ===
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        #graffiti-scanner {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: #000;
            color: #fff;
            border-radius: 16px;
            font-family: 'Inter', sans-serif;
            z-index: 99999;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            border: 1px solid #222;
        }
        
        @media (max-width: 768px) {
            #graffiti-scanner {
                top: 10px;
                left: 10px;
                right: 10px;
                width: auto !important;
                max-width: none !important;
                border-radius: 14px;
                margin: 0;
            }
            
            .g-content {
                max-height: 260px !important;
                padding: 14px !important;
            }
            
            .stats-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 8px !important;
                margin-bottom: 12px !important;
            }
            
            .stat-card {
                padding: 10px !important;
            }
            
            .stat-value {
                font-size: 18px !important;
            }
            
            .stat-label {
                font-size: 8px !important;
                margin-top: 4px !important;
            }
            
            .progress-section {
                margin-bottom: 12px !important;
            }
            
            /* BUTTONS CONTAINER - ALL IN ONE ROW ON MOBILE */
            .buttons-row {
                display: flex !important;
                gap: 6px !important;
                margin-bottom: 12px !important;
                width: 100% !important;
            }
            
            /* MOBILE BUTTONS */
            .btn-control, .btn-secondary {
                flex: 1 !important;
                padding: 10px !important;
                font-size: 12px !important;
                min-height: 38px !important;
                border-radius: 8px !important;
                margin: 0 !important;
                text-align: center !important;
                white-space: nowrap !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }
            
            .btn-control {
                font-weight: 600 !important;
                letter-spacing: 0.2px !important;
            }
            
            .btn-secondary {
                font-weight: 500 !important;
                border-width: 1px !important;
                min-width: 0 !important;
                flex: 0 0 auto !important;
                width: 38px !important;
                padding: 10px !important;
            }
            
            .btn-secondary.btn-reset {
                width: auto !important;
                flex: 1 !important;
                min-width: 0 !important;
                font-size: 11px !important;
            }
            
            .status-message {
                padding: 8px !important;
                min-height: 24px !important;
                font-size: 11px !important;
                border-radius: 8px !important;
                margin-top: 12px !important;
            }
            
            .g-header {
                padding: 12px !important;
            }
            
            .g-brand {
                font-size: 13px !important;
            }
            
            .g-status {
                font-size: 9px !important;
                padding: 4px 8px !important;
            }
        }
        
        @media (max-width: 480px) {
            #graffiti-scanner {
                top: 8px;
                left: 8px;
                right: 8px;
                border-radius: 12px;
            }
            
            .g-content {
                max-height: 240px !important;
                padding: 12px !important;
            }
            
            /* SMALLER MOBILE BUTTONS */
            .buttons-row {
                gap: 5px !important;
                margin-bottom: 10px !important;
            }
            
            .btn-control, .btn-secondary {
                padding: 9px !important;
                font-size: 11px !important;
                min-height: 36px !important;
                border-radius: 7px !important;
            }
            
            .btn-secondary {
                width: 36px !important;
                padding: 9px !important;
            }
            
            .btn-secondary.btn-reset {
                font-size: 10px !important;
            }
            
            .stat-card {
                padding: 8px !important;
            }
            
            .stat-value {
                font-size: 16px !important;
            }
            
            .stat-label {
                font-size: 7px !important;
            }
            
            .status-message {
                padding: 6px !important;
                min-height: 22px !important;
                font-size: 10px !important;
                margin-top: 10px !important;
            }
            
            .g-header {
                padding: 10px !important;
            }
        }
        
        @media (max-width: 360px) {
            /* EXTRA SMALL DEVICES */
            .buttons-row {
                gap: 4px !important;
            }
            
            .btn-control, .btn-secondary {
                padding: 8px !important;
                font-size: 10px !important;
                min-height: 34px !important;
            }
            
            .btn-secondary {
                width: 34px !important;
                padding: 8px !important;
            }
            
            .btn-secondary.btn-reset {
                font-size: 9px !important;
            }
            
            .stats-grid {
                gap: 6px !important;
            }
            
            .stat-card {
                padding: 6px !important;
            }
        }
        
        @media (min-width: 769px) {
            .buttons-row {
                display: block !important;
            }
            
            .btn-control, .btn-secondary {
                width: 100% !important;
                margin-bottom: 8px !important;
            }
        }
        
        .g-header {
            padding: 14px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #222;
            background: #0a0a0a;
        }
        
        .g-brand {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: -0.2px;
        }
        
        .g-brand-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        
        .g-status {
            font-size: 9px;
            padding: 3px 6px;
            background: #1a1a1a;
            color: #888;
            border-radius: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .g-content {
            padding: 16px;
            max-height: 320px;
            overflow-y: auto;
        }
        
        .g-content::-webkit-scrollbar { 
            width: 3px; 
        }
        
        .g-content::-webkit-scrollbar-track { 
            background: #111; 
        }
        
        .g-content::-webkit-scrollbar-thumb { 
            background: #333; 
            border-radius: 1.5px; 
        }
        
        .buttons-row {
            display: block;
            margin-bottom: 16px;
        }
        
        .btn-control {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-weight: 600;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 8px;
            letter-spacing: 0.2px;
        }
        
        .btn-control:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .btn-control:disabled {
            background: #222;
            color: #666;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        
        .btn-secondary {
            width: 100%;
            padding: 8px;
            border: 1px solid #333;
            border-radius: 8px;
            background: #111;
            color: #fff;
            font-weight: 500;
            font-size: 10px;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 8px;
        }
        
        .btn-secondary:hover {
            background: #1a1a1a;
            border-color: #444;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-bottom: 16px;
        }
        
        .stat-card {
            background: #0a0a0a;
            border-radius: 10px;
            padding: 10px;
            text-align: center;
            border: 1px solid #1a1a1a;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: 600;
            color: #fff;
            line-height: 1;
        }
        
        .stat-label {
            font-size: 8px;
            color: #666;
            text-transform: uppercase;
            font-weight: 600;
            margin-top: 4px;
            letter-spacing: 0.3px;
        }
        
        .progress-section {
            margin-bottom: 16px;
        }
        
        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
        }
        
        .progress-label {
            font-size: 9px;
            color: #888;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.3px;
        }
        
        .progress-percent {
            font-size: 10px;
            font-weight: 600;
            color: #667eea;
        }
        
        .progress-track {
            height: 3px;
            background: #222;
            border-radius: 1.5px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            width: 0%;
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 1.5px;
        }
        
        /* COMPACT STATUS MESSAGE */
        .status-message {
            background: #0a0a0a;
            border: 1px solid #222;
            border-radius: 8px;
            padding: 8px;
            margin-top: 12px;
            font-size: 10px;
            color: #aaa;
            line-height: 1.3;
            min-height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        
        .status-active { color: #667eea; }
        .status-complete { color: #10b981; }
        .status-cooldown { color: #f59e0b; }
        .status-error { color: #dc2626; }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        
        /* SIMPLE PAUSE BUTTON - NO ICONS, JUST TEXT */
        .btn-pause {
            font-family: 'Inter', sans-serif !important;
        }
        
        @media (max-width: 768px) {
            .btn-pause {
                font-size: 10px !important;
                padding: 8px !important;
            }
        }
        
        /* SIMPLE COOLDOWN STYLE */
        .cooldown-text {
            font-family: 'Inter', monospace;
            font-weight: 700;
            font-size: 11px;
            color: #f59e0b;
            letter-spacing: 0.5px;
        }
    `;
    document.head.appendChild(style);

    // === UI ===
    const ui = document.createElement('div');
    ui.id = 'graffiti-scanner';
    ui.innerHTML = `
        <div class="g-header">
            <div class="g-brand">
                <div class="g-brand-icon">🎨</div>
                Graffiti Spray
            </div>
            <div id="status-badge" class="g-status">Ready</div>
        </div>
        
        <div class="g-content">
            <div class="stats-grid">
                <div class="stat-card">
                    <div id="stat-total" class="stat-value">0</div>
                    <div class="stat-label">Total</div>
                </div>
                <div class="stat-card">
                    <div id="stat-remaining" class="stat-value">0</div>
                    <div class="stat-label">Remaining</div>
                </div>
            </div>
            
            <div class="buttons-row">
                <button id="btn-start" class="btn-control">Start</button>
                <button id="btn-pause" class="btn-secondary btn-pause" disabled>Pause</button>
                <button id="btn-reset" class="btn-secondary btn-reset">Reset</button>
            </div>
            
            <div class="progress-section">
                <div class="progress-header">
                    <div class="progress-label">Progress</div>
                    <div id="progress-percent" class="progress-percent">0%</div>
                </div>
                <div class="progress-track">
                    <div id="progress-fill" class="progress-fill"></div>
                </div>
            </div>
            
            <div id="status-message" class="status-message">
                Ready
            </div>
        </div>
    `;
    document.body.appendChild(ui);

    // === UI ELEMENTS ===
    const elements = {
        statusBadge: document.getElementById('status-badge'),
        statTotal: document.getElementById('stat-total'),
        statRemaining: document.getElementById('stat-remaining'),
        btnStart: document.getElementById('btn-start'),
        btnPause: document.getElementById('btn-pause'),
        btnReset: document.getElementById('btn-reset'),
        progressPercent: document.getElementById('progress-percent'),
        progressFill: document.getElementById('progress-fill'),
        statusMessage: document.getElementById('status-message')
    };

    // === UI FUNCTIONS ===
    const formatCooldownTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const updateUI = (message, status = 'active', progress = 0) => {
        const percent = Math.min(100, Math.max(0, progress));
        
        // Update status message (compact version)
        elements.statusMessage.textContent = message;
        
        // Update progress
        elements.progressFill.style.width = `${percent}%`;
        elements.progressPercent.textContent = `${Math.round(percent)}%`;
        
        // Update stats
        const remaining = Math.max(0, localeLinks.length - visited.length);
        elements.statTotal.textContent = localeLinks.length;
        elements.statRemaining.textContent = remaining;
        
        // Update status badge
        let statusText = 'Ready';
        let statusClass = '';
        
        switch(status) {
            case 'active':
                statusText = 'Active';
                statusClass = 'status-active';
                break;
            case 'cooldown':
                statusText = 'Wait';
                statusClass = 'status-cooldown pulse';
                break;
            case 'paused':
                statusText = 'Paused';
                statusClass = '';
                break;
            case 'complete':
                statusText = 'Complete';
                statusClass = 'status-complete';
                break;
            case 'error':
                statusText = 'Error';
                statusClass = 'status-error';
                break;
        }
        
        elements.statusBadge.textContent = statusText;
        elements.statusBadge.className = `g-status ${statusClass}`;
        
        // Update button states
        elements.btnStart.disabled = isRunning || isLocked();
        elements.btnPause.disabled = !isRunning;
        elements.btnPause.textContent = isPaused ? 'Resume' : 'Pause';
        
        // Mobile button text
        if (window.innerWidth <= 768) {
            elements.btnStart.textContent = 'Start';
            elements.btnPause.textContent = isPaused ? '▶' : '⏸';
            elements.btnReset.textContent = 'Reset';
        } else {
            elements.btnStart.textContent = 'Start Spraying';
            elements.btnPause.textContent = isPaused ? 'Resume' : 'Pause';
            elements.btnReset.textContent = 'Reset Visited';
        }
    };

    // === FIND LOCALE LINKS ===
    const findLocaleLinks = () => {
        const links = [];
        const table = document.getElementById('tablelocales');
        
        if (table) {
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const link = row.querySelector('a[id*="lnkLocale"]');
                if (link && link.href) {
                    links.push(link.href);
                }
            });
        }
        
        return links;
    };

    // === CHECK IF LOCALE HAS GRAFFITI ===
    const checkLocaleForGraffiti = (url) => {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none;position:absolute;width:1px;height:1px;opacity:0;';
            iframe.src = url;
            document.body.appendChild(iframe);
            
            iframe.onload = () => {
                const timer = setTimeout(() => {
                    try {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        const graffitiDiv = doc.getElementById('ctl00_cphLeftColumn_ctl00_divGraffiti');
                        const hasGraffiti = graffitiDiv !== null;
                        
                        iframe.remove();
                        resolve(hasGraffiti);
                    } catch (e) {
                        iframe.remove();
                        resolve(false);
                    }
                }, 1000);
                
                timers.push(timer);
            };
            
            iframe.onerror = () => {
                iframe.remove();
                resolve(false);
            };
        });
    };

    // === USE SPRAYPAINT ===
    const useSpraypaint = () => {
        return new Promise((resolve) => {
            updateUI('Inventory...', 'active');
            
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none;position:absolute;width:1px;height:1px;opacity:0;';
            iframe.src = '/World/Popmundo.aspx/Character/Items/';
            document.body.appendChild(iframe);
            
            iframe.onload = () => {
                const timer = setTimeout(() => {
                    try {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        const rows = doc.querySelectorAll('tr');
                        
                        let sprayRow = null;
                        for (const row of rows) {
                            const text = row.textContent.toLowerCase();
                            const hasSpray = text.includes('spraypaint') || 
                                            text.includes('sprey boya') ||
                                            text.includes('can of spray');
                            const hasButton = row.querySelector('input[title*="Use"], input[title*="Kullan"]');
                            
                            if (hasSpray && hasButton) {
                                sprayRow = row;
                                break;
                            }
                        }
                        
                        if (!sprayRow) {
                            updateUI('No spraypaint', 'error');
                            iframe.remove();
                            resolve(false);
                            return;
                        }
                        
                        updateUI('Spraying...', 'active');
                        
                        const useButton = sprayRow.querySelector('input[title*="Use"], input[title*="Kullan"]');
                        if (useButton) {
                            useButton.click();
                            
                            // Poll for notification
                            pollForNotification(iframe).then((result) => {
                                iframe.remove();
                                resolve(result);
                            });
                        } else {
                            throw new Error('Use button not found');
                        }
                        
                    } catch (e) {
                        console.error('Spraypaint error:', e);
                        updateUI('Error', 'error');
                        iframe.remove();
                        resolve(false);
                    }
                }, 2000);
                
                timers.push(timer);
            };
            
            iframe.onerror = () => {
                updateUI('Inventory error', 'error');
                iframe.remove();
                resolve(false);
            };
        });
    };

    // === POLL FOR NOTIFICATION ===
    const pollForNotification = (iframe) => {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 10;
            
            const checkNotification = () => {
                if (attempts >= maxAttempts) {
                    resolve('timeout');
                    return;
                }
                
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    const notif = doc.querySelector('.notification-real, .notification');
                    const text = notif?.textContent?.toLowerCase() || '';
                    
                    if (text.includes('fsssssssst')) {
                        // Success
                        resolve('success');
                    } else if (text.includes('more recently') || text.includes('cooldown')) {
                        // Cooldown triggered
                        resolve('cooldown');
                    } else if (text.includes('already') || text.includes('graffiti')) {
                        // Already painted
                        resolve('already');
                    } else if (text) {
                        // Some other notification
                        resolve('other');
                    } else {
                        // Keep checking
                        attempts++;
                        const timer = setTimeout(checkNotification, 1000);
                        timers.push(timer);
                    }
                } catch (e) {
                    attempts++;
                    const timer = setTimeout(checkNotification, 1000);
                    timers.push(timer);
                }
            };
            
            const timer = setTimeout(checkNotification, 2000);
            timers.push(timer);
        });
    };

    // === MOVE TO LOCALE ===
    const moveToLocale = (localeId) => {
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'display:none;position:absolute;width:1px;height:1px;opacity:0;';
            iframe.src = `/World/Popmundo.aspx/Locale/MoveToLocale/${localeId}`;
            document.body.appendChild(iframe);
            
            iframe.onload = () => {
                const timer = setTimeout(() => {
                    iframe.remove();
                    resolve(true);
                }, 2000);
                
                timers.push(timer);
            };
            
            iframe.onerror = () => {
                iframe.remove();
                resolve(false);
            };
        });
    };

    // === PROCESS LOCALE ===
    const processLocale = async (url) => {
        if (isPaused || isLocked()) {
            return;
        }
        
        // Check if already visited
        if (visited.includes(url)) {
            return;
        }
        
        const localeId = url.split('/').pop();
        const progress = (visited.length / localeLinks.length) * 100;
        
        // Check for existing graffiti
        updateUI(`${visited.length + 1}/${localeLinks.length}`, 'active', progress);
        const hasGraffiti = await checkLocaleForGraffiti(url);
        
        if (hasGraffiti) {
            // Already painted, skip
            updateUI(`Skip`, 'active', progress);
            visited.push(url);
            saveVisited(visited);
        } else {
            // Need to paint
            updateUI(`Moving`, 'active', progress);
            const moved = await moveToLocale(localeId);
            
            if (moved) {
                updateUI(`Spraying`, 'active', progress);
                const sprayResult = await useSpraypaint();
                
                if (sprayResult === 'success') {
                    // Successfully painted
                    updateUI(`Done`, 'complete', progress);
                    visited.push(url);
                    saveVisited(visited);
                    lock(); // Start cooldown
                    startCooldown();
                } else if (sprayResult === 'cooldown') {
                    // Cooldown triggered
                    updateUI(`Cooldown`, 'cooldown', progress);
                    visited.push(url);
                    saveVisited(visited);
                    lock();
                    startCooldown();
                } else if (sprayResult === 'already') {
                    // Already painted (race condition)
                    updateUI(`Done`, 'active', progress);
                    visited.push(url);
                    saveVisited(visited);
                } else {
                    // Error or no spraypaint
                    updateUI(`Error`, 'error', progress);
                    visited.push(url);
                    saveVisited(visited);
                }
            } else {
                // Failed to move
                updateUI(`Move error`, 'error', progress);
                visited.push(url);
                saveVisited(visited);
            }
        }
    };

    // === COOLDOWN TIMER ===
    const startCooldown = () => {
        clearTimers();
        
        let remaining = CONFIG.COOLDOWN_SECONDS;
        
        const updateCooldown = () => {
            if (isPaused) return;
            
            const percent = ((CONFIG.COOLDOWN_SECONDS - remaining) / CONFIG.COOLDOWN_SECONDS) * 100;
            const timeDisplay = formatCooldownTime(remaining);
            
            updateUI(
                `${timeDisplay}`,
                'cooldown',
                percent
            );
            
            if (remaining > 0) {
                remaining--;
                const timer = setTimeout(updateCooldown, 1000);
                timers.push(timer);
            } else {
                unlock();
                updateUI('Continue', 'active', 100);
                
                // Continue with the next locale after cooldown
                const continueTimer = setTimeout(() => {
                    continueProcess();
                }, 1500);
                timers.push(continueTimer);
            }
        };
        
        updateCooldown();
    };

    // === CONTINUE PROCESS ===
    const continueProcess = async () => {
        if (isPaused) return;
        
        // Find next unvisited locale
        const nextLocale = localeLinks.find(url => !visited.includes(url));
        
        if (nextLocale) {
            await processLocale(nextLocale);
            
            // Continue with next locale after delay
            if (!isPaused && !isLocked()) {
                const nextTimer = setTimeout(() => {
                    continueProcess();
                }, CONFIG.DELAY_BETWEEN_LOCALES);
                timers.push(nextTimer);
            }
        } else {
            // All locales processed
            updateUI('Complete', 'complete', 100);
            isRunning = false;
            elements.btnStart.disabled = false;
            elements.btnPause.disabled = true;
        }
    };

    // === MAIN PROCESS ===
    const startProcess = async () => {
        if (isRunning || isLocked()) return;
        
        isRunning = true;
        isPaused = false;
        elements.btnStart.disabled = true;
        elements.btnPause.disabled = false;
        currentLocaleIndex = 0;
        
        // Find all locale links
        localeLinks = findLocaleLinks();
        updateUI(`${localeLinks.length} locales`, 'active', 0);
        
        // Start processing
        continueProcess();
    };

    // === EVENT HANDLERS ===
    elements.btnStart.addEventListener('click', () => {
        if (isLocked()) {
            const remaining = Math.ceil((cooldownEndTime - Date.now()) / 1000);
            updateUI(`${formatCooldownTime(remaining)}`, 'cooldown');
            return;
        }
        startProcess();
    });
    
    elements.btnPause.addEventListener('click', () => {
        if (isRunning) {
            isPaused = !isPaused;
            updateUI(isPaused ? 'Paused' : 'Resume', isPaused ? 'paused' : 'active');
            
            // If resuming and not in cooldown, continue
            if (!isPaused && !isLocked()) {
                continueProcess();
            }
        }
    });
    
    elements.btnReset.addEventListener('click', () => {
        if (confirm('Reset all visited locales?')) {
            visited = [];
            saveVisited(visited);
            updateUI('Reset', 'active', 0);
        }
    });

    // === INITIALIZE ===
    localeLinks = findLocaleLinks();
    const remaining = Math.max(0, localeLinks.length - visited.length);
    const progress = visited.length > 0 ? (visited.length / localeLinks.length) * 100 : 0;
    
    updateUI('Ready', 'active', progress);
    
    // Check if we're in cooldown
    if (isLocked()) {
        const remainingTime = Math.ceil((cooldownEndTime - Date.now()) / 1000);
        updateUI(`${formatCooldownTime(remainingTime)}`, 'cooldown');
        startCooldown();
    }
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearTimers();
    });
})();