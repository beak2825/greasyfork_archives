// ==UserScript==
// @name         Claude Monitor
// @namespace    https://claude.ai/
// @version      6.10
// @description  Monitor and optimize Claude.ai - DOM trimming, usage tracking, and performance tools
// @author       HenryC (with nod to Claude)
// @match        https://claude.ai/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562271/Claude%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/562271/Claude%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple instances - check both window flag and DOM
    if (window.__claudeMonitorLoaded || document.getElementById('claude-monitor-panel')) {
        console.log('Claude Monitor: Already running, skipping duplicate instance');
        // If panel exists but flag wasn't set, set it now
        window.__claudeMonitorLoaded = true;
        return;
    }
    window.__claudeMonitorLoaded = true;

    // Configuration
    let keepVisible = 10; // Number of turns to keep in DOM
    let isEnabled = false;
    let newChatThreshold = 90; // Threshold for suggesting new chat
    let thresholdAlertShown = false; // Track if we've shown the alert
    let showThresholdBar = true; // Show progress bar instead of numbers
    let panelPlacement = 'bottom-right'; // Panel position: top-left, top-right, bottom-left, bottom-right

    // Cache for removed elements - stores { html, placeholder, parentRef }
    const removedCache = new Map();
    let cacheIdCounter = 0;
    let currentPath = window.location.pathname; // Track current URL

    // Usage data from stream interception
    let lastUsageData = null;

    // ==================== FETCH INTERCEPTOR FOR USAGE DATA ====================
    
    function installFetchInterceptor() {
        if (window.__claudeMonitorFetchIntercepted) {
            return;
        }
        window.__claudeMonitorFetchIntercepted = true;
        
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const [url, options] = args;
            const urlStr = typeof url === 'string' ? url : url?.url || '';
            
            // Only intercept completion requests
            if (!urlStr.includes('/completion')) {
                return originalFetch.apply(this, args);
            }
            
            const response = await originalFetch.apply(this, args);
            
            // Clone response so we can read it without affecting the original
            const clone = response.clone();
            
            // Process the SSE stream in the background
            processSSEStream(clone).catch(err => {
                console.warn('Claude Monitor: Error processing stream:', err);
            });
            
            return response;
        };
        
        console.log('Claude Monitor: Fetch interceptor installed');
    }
    
    async function processSSEStream(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                
                // Parse SSE events (format: "data: {...}\n\n")
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.slice(6).trim();
                        
                        if (jsonStr === '[DONE]') continue;
                        
                        try {
                            const event = JSON.parse(jsonStr);
                            
                            // Look for message_limit event
                            if (event.type === 'message_limit' && event.message_limit) {
                                handleMessageLimit(event.message_limit);
                            }
                        } catch (e) {
                            // Not valid JSON, skip
                        }
                    }
                }
            }
        } catch (err) {
            // Stream reading error - likely aborted, ignore
        }
    }
    
    function handleMessageLimit(messageLimit) {
        const windows = messageLimit.windows;
        if (!windows) return;
        
        lastUsageData = {
            session: windows['5h'] || null,
            weekly: windows['7d'] || null,
            timestamp: Date.now()
        };
        
        updateUsageDisplay();
    }
    
    function formatResetTime(unixTimestamp) {
        if (!unixTimestamp) return '—';
        
        const resetDate = new Date(unixTimestamp * 1000);
        const now = new Date();
        const diffMs = resetDate - now;
        
        if (diffMs <= 0) return 'soon';
        
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays > 0) {
            return `${diffDays}d ${diffHours % 24}h`;
        } else if (diffHours > 0) {
            return `${diffHours}h ${diffMins % 60}m`;
        } else {
            return `${diffMins}m`;
        }
    }
    
    function updateUsageDisplay() {
        if (!lastUsageData) return;
        
        const { session, weekly } = lastUsageData;
        
        // Helper to get color class based on percentage
        const getColorClass = (pct) => {
            if (pct >= 65) return 'danger';
            if (pct >= 50) return 'warning';
            return '';
        };
        
        // Update session (5h) display
        if (session) {
            const pct = Math.round(session.utilization * 100);
            const resetTime = formatResetTime(session.resets_at);
            
            // Values mode
            const sessionResetEl = document.getElementById('monitor-session-reset');
            const sessionPctEl = document.getElementById('monitor-session-pct');
            if (sessionResetEl) sessionResetEl.textContent = resetTime;
            if (sessionPctEl) {
                sessionPctEl.textContent = pct + '%';
                sessionPctEl.classList.remove('warning', 'danger');
                const colorClass = getColorClass(pct);
                if (colorClass) sessionPctEl.classList.add(colorClass);
            }
            
            // Bar mode
            const sessionBar = document.getElementById('monitor-session-bar');
            const sessionBarContainer = document.getElementById('monitor-session-bar-container');
            if (sessionBar) {
                sessionBar.style.width = pct + '%';
                sessionBar.classList.remove('warning', 'danger');
                const colorClass = getColorClass(pct);
                if (colorClass) sessionBar.classList.add(colorClass);
            }
            if (sessionBarContainer) {
                sessionBarContainer.title = `${pct}% - Session resets in ${resetTime}`;
            }
            
            // Update badge with session usage
            const iconBadge = document.getElementById('monitor-icon-badge');
            if (iconBadge) {
                iconBadge.textContent = pct + '%';
                iconBadge.title = `Token usage: ${pct}%`;
                iconBadge.classList.remove('warning', 'danger');
                const colorClass = getColorClass(pct);
                if (colorClass) iconBadge.classList.add(colorClass);
            }
        }
        
        // Update weekly (7d) display
        if (weekly) {
            const pct = Math.round(weekly.utilization * 100);
            const resetTime = formatResetTime(weekly.resets_at);
            
            // Values mode
            const weeklyResetEl = document.getElementById('monitor-weekly-reset');
            const weeklyPctEl = document.getElementById('monitor-weekly-pct');
            if (weeklyResetEl) weeklyResetEl.textContent = resetTime;
            if (weeklyPctEl) {
                weeklyPctEl.textContent = pct + '%';
                weeklyPctEl.classList.remove('warning', 'danger');
                const colorClass = getColorClass(pct);
                if (colorClass) weeklyPctEl.classList.add(colorClass);
            }
            
            // Bar mode
            const weeklyBar = document.getElementById('monitor-weekly-bar');
            const weeklyBarContainer = document.getElementById('monitor-weekly-bar-container');
            if (weeklyBar) {
                weeklyBar.style.width = pct + '%';
                weeklyBar.classList.remove('warning', 'danger');
                const colorClass = getColorClass(pct);
                if (colorClass) weeklyBar.classList.add(colorClass);
            }
            if (weeklyBarContainer) {
                weeklyBarContainer.title = `${pct}% - Weekly resets in ${resetTime}`;
            }
        }
    }

    // ==================== END FETCH INTERCEPTOR ====================

    // Reset state when URL changes (switching conversations)
    function checkUrlChange() {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;

            // Clear cache - old messages are for different conversation
            removedCache.clear();
            cacheIdCounter = 0;
            thresholdAlertShown = false;

            // Remove any orphaned placeholders from previous conversation
            document.querySelectorAll('.claude-monitor-placeholder').forEach(p => p.remove());

            // Remove any existing toast
            const existingToast = document.querySelector('.claude-monitor-toast');
            if (existingToast) existingToast.remove();

            // Stop existing observer
            stopObserver();

            // Load settings for new URL
            const hadSavedSettings = loadSettings();

            // Update UI elements with new settings
            const panel = document.getElementById('claude-monitor-panel');
            const slider = document.getElementById('monitor-keep-slider');
            const keepValueEl = document.getElementById('monitor-keep-value');
            const thresholdSlider = document.getElementById('monitor-threshold-slider');
            const thresholdValueEl = document.getElementById('monitor-threshold-value');
            const iconToggle = document.getElementById('monitor-icon-toggle');
            const toggleBtn = document.getElementById('monitor-toggle');
            const collapseBtn = document.querySelector('.monitor-collapse-btn');

            // Collapse if enabled from saved settings, expand otherwise
            if (panel && collapseBtn) {
                if (hadSavedSettings && isEnabled) {
                    panel.classList.add('collapsed');
                } else {
                    panel.classList.remove('collapsed');
                }
            }

            if (slider) {
                slider.value = keepVisible;
                if (keepVisible > parseInt(slider.max, 10)) {
                    slider.max = keepVisible + 20;
                }
            }
            if (keepValueEl) keepValueEl.textContent = keepVisible;
            if (thresholdSlider) {
                thresholdSlider.value = newChatThreshold;
                if (newChatThreshold > parseInt(thresholdSlider.max, 10)) {
                    thresholdSlider.max = newChatThreshold + 25;
                }
            }
            if (thresholdValueEl) thresholdValueEl.textContent = newChatThreshold;
            if (iconToggle) {
                iconToggle.classList.toggle('disabled', !isEnabled);
            }
            if (toggleBtn) {
                toggleBtn.textContent = isEnabled ? 'Disable' : 'Enable';
                toggleBtn.classList.toggle('active', isEnabled);
            }

            // Update bar toggle and collapsed stats
            const barToggle = document.getElementById('monitor-bar-toggle');
            const collapsedStats = document.getElementById('monitor-collapsed-stats');
            const usageStats = document.getElementById('monitor-usage-stats');
            if (barToggle) {
                barToggle.classList.toggle('active', showThresholdBar);
            }
            if (collapsedStats) {
                collapsedStats.classList.toggle('show-bar', showThresholdBar);
            }
            if (usageStats) {
                usageStats.classList.toggle('show-bar', showThresholdBar);
            }

            // Update placement
            const placementSelect = document.getElementById('monitor-placement');
            if (placementSelect) {
                placementSelect.value = panelPlacement;
            }
            if (panel) {
                panel.classList.remove('placement-top-left', 'placement-top-right', 'placement-bottom-left', 'placement-bottom-right');
                panel.classList.add('placement-' + panelPlacement);
            }

            // If enabled for this conversation, start pruning after delay
            if (isEnabled) {
                setTimeout(() => {
                    pruneMessages();
                    startObserver();
                }, 1000);
            }

            updateUI();
        }
    }

    // Storage key based on current conversation URL
    function getStorageKey() {
        // Use pathname as key (e.g., /chat/abc123 or /project/xyz/chat/abc123)
        return 'claude-monitor:' + window.location.pathname;
    }

    // Save settings to localStorage
    function saveSettings() {
        try {
            const settings = {
                keepVisible: keepVisible,
                isEnabled: isEnabled,
                newChatThreshold: newChatThreshold,
                showThresholdBar: showThresholdBar,
                panelPlacement: panelPlacement
            };
            localStorage.setItem(getStorageKey(), JSON.stringify(settings));
        } catch (e) {
            console.warn('Claude Monitor: Failed to save settings', e);
        }
    }

    // Load settings from localStorage
    function loadSettings() {
        try {
            const stored = localStorage.getItem(getStorageKey());
            if (stored) {
                const settings = JSON.parse(stored);
                if (typeof settings.keepVisible === 'number') {
                    keepVisible = settings.keepVisible;
                }
                if (typeof settings.isEnabled === 'boolean') {
                    isEnabled = settings.isEnabled;
                }
                if (typeof settings.newChatThreshold === 'number') {
                    newChatThreshold = settings.newChatThreshold;
                }
                if (typeof settings.showThresholdBar === 'boolean') {
                    showThresholdBar = settings.showThresholdBar;
                }
                if (typeof settings.panelPlacement === 'string') {
                    panelPlacement = settings.panelPlacement;
                }
                return true;
            } else {
                // No saved settings - reset to defaults
                keepVisible = 10;
                isEnabled = false;
                newChatThreshold = 90;
                showThresholdBar = true;
                panelPlacement = 'bottom-right';
            }
        } catch (e) {
            console.warn('Claude Monitor: Failed to load settings', e);
            // Reset to defaults on error
            keepVisible = 10;
            isEnabled = false;
            newChatThreshold = 90;
            showThresholdBar = true;
            panelPlacement = 'bottom-right';
        }
        return false;
    }

    // Add styles for the control panel
    const styles = `
        #claude-monitor-panel {
            position: fixed;
            background: #1a1a1a;
            border: 1px solid #3b3b3b;
            border-radius: 12px;
            padding: 12px 16px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            color: #e0e0e0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            min-width: 200px;
            user-select: none;
        }

        #claude-monitor-panel.placement-top-left {
            top: 20px;
            left: 20px;
        }

        #claude-monitor-panel.placement-top-right {
            top: 20px;
            right: 20px;
        }

        #claude-monitor-panel.placement-bottom-left {
            bottom: 20px;
            left: 20px;
        }

        #claude-monitor-panel.placement-bottom-right {
            bottom: 20px;
            right: 20px;
        }

        #claude-monitor-panel.collapsed {
            min-width: 100px;
            padding: 8px 12px;
        }

        #claude-monitor-panel.collapsed .monitor-content {
            display: none;
        }

        .monitor-content {
            margin-top: 10px;
        }

        .monitor-collapsed-stats {
            display: none;
            font-size: 9px;
            color: #888;
            margin-top: 1px;
        }

        .monitor-collapsed-pct {
            color: #5a9a68;
            font-weight: 600;
            transition: color 0.3s;
        }

        .monitor-collapsed-pct.warning {
            color: #b8923e;
        }

        .monitor-collapsed-pct.danger {
            color: #b85555;
        }

        .monitor-collapsed-stats .warning {
            color: #b8923e;
        }

        .monitor-collapsed-stats .danger {
            color: #b85555;
        }

        .monitor-collapsed-stats .normal {
            color: #666;
        }

        .monitor-threshold-bar-container {
            display: inline-block;
            width: 50px;
            height: 6px;
            background: #3b3b3b;
            border-radius: 3px;
            overflow: hidden;
            vertical-align: middle;
        }

        .monitor-threshold-bar-container-full {
            display: block;
            width: 100%;
            height: 10px;
            background: #3b3b3b;
            border-radius: 5px;
            overflow: hidden;
        }

        .monitor-threshold-bar {
            display: block;
            height: 100%;
            width: 0%;
            background: #5a9a68;
            border-radius: 5px;
            transition: width 0.3s, background-color 0.3s;
        }

        .monitor-threshold-bar.warning {
            background: #b8923e;
        }

        .monitor-threshold-bar.danger {
            background: #b85555;
        }

        .monitor-collapsed-numbers {
            display: inline;
        }

        .monitor-collapsed-bar {
            display: none;
        }

        .monitor-collapsed-stats.show-bar .monitor-collapsed-numbers {
            display: none;
        }

        .monitor-collapsed-stats.show-bar .monitor-collapsed-bar {
            display: block;
            margin-top: 6px;
        }

        .monitor-usage-stats {
            font-size: 9px;
            color: #888;
            margin-top: 4px;
        }

        #claude-monitor-panel:not(.collapsed) .monitor-usage-stats {
            display: none;
        }

        .monitor-usage-bars {
            display: none;
        }

        .monitor-usage-values {
            display: block;
        }

        .monitor-usage-stats.show-bar .monitor-usage-bars {
            display: block;
        }

        .monitor-usage-stats.show-bar .monitor-usage-values {
            display: none;
        }

        .monitor-usage-bar-container {
            width: 100%;
            height: 10px;
            background: #3b3b3b;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 4px;
        }

        .monitor-usage-bar {
            height: 100%;
            width: 0%;
            background: #5a9a68;
            border-radius: 5px;
            transition: width 0.3s, background 0.3s;
        }

        .monitor-usage-bar.warning {
            background: #b8923e;
        }

        .monitor-usage-bar.danger {
            background: #b85555;
        }

        .monitor-usage-row {
            margin-top: 2px;
        }

        .monitor-usage-label {
            color: #666;
        }

        .monitor-usage-reset {
            color: #888;
        }

        .monitor-usage-sep {
            color: #555;
        }

        .monitor-usage-pct {
            color: #5a9a68;
            font-weight: 600;
            transition: color 0.3s;
        }

        .monitor-usage-pct.warning {
            color: #b8923e;
        }

        .monitor-usage-pct.danger {
            color: #b85555;
        }

        .monitor-usage-live {
            color: #22c55e;
            font-size: 7px;
            margin-left: 2px;
        }

        .monitor-toggle-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            font-size: 11px;
            color: #aaa;
        }

        .monitor-toggle-switch {
            position: relative;
            width: 32px;
            height: 18px;
            background: #3b3b3b;
            border-radius: 9px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .monitor-toggle-switch.active {
            background: #da7756;
        }

        .monitor-toggle-switch::after {
            content: '';
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            background: #fff;
            border-radius: 50%;
            transition: transform 0.2s;
        }

        .monitor-toggle-switch.active::after {
            transform: translateX(14px);
        }

        .monitor-select {
            background: #3b3b3b;
            color: #e0e0e0;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
        }

        .monitor-select:hover {
            background: #4b4b4b;
        }

        #claude-monitor-panel.collapsed .monitor-collapsed-stats {
            display: block;
        }

        .monitor-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1px;
            cursor: pointer;
        }

        #claude-monitor-panel.collapsed .monitor-header {
            margin-bottom: 0;
        }

        .monitor-title {
            font-weight: 600;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .monitor-claude-icon {
            width: 35px;
            height: 35px;
            flex-shrink: 0;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .monitor-claude-icon:hover {
            opacity: 0.8;
        }

        .monitor-claude-icon.disabled path {
            fill: #666;
        }

        .monitor-icon-wrapper {
            position: relative;
            display: inline-block;
        }

        .monitor-icon-badge {
            position: absolute;
            top: -4px;
            right: -6px;
            background: #3b3b3b;
            color: #5a9a68;
            font-size: 9px;
            font-weight: bold;
            min-width: 16px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 8px;
            padding: 0 4px;
            transition: color 0.3s;
        }

        .monitor-icon-badge.warning {
            color: #b8923e;
        }

        .monitor-icon-badge.danger {
            color: #b85555;
        }

        .monitor-collapse-btn {
            background: none;
            border: none;
            color: #3b3b3b;
            cursor: pointer;
            padding: 0 4px;
            display: flex;
            align-items: center;
        }

        .monitor-collapse-btn:hover {
            color: #888;
        }

        .monitor-gear-icon {
            width: 16px;
            height: 16px;
            display: none;
        }

        .monitor-minus-icon {
            font-size: 18px;
            line-height: 1;
            display: inline;
        }

        #claude-monitor-panel.collapsed .monitor-gear-icon {
            display: inline;
        }

        #claude-monitor-panel.collapsed .monitor-minus-icon {
            display: none;
        }

        .monitor-stats {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 6px;
            margin-bottom: 12px;
            padding: 8px;
            background: #252525;
            border-radius: 8px;
        }

        .monitor-stat {
            text-align: center;
        }

        .monitor-stat-value {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
        }

        .monitor-stat-value.removed {
            color: #f59e0b;
        }

        .monitor-stat-value.removed.warning {
            color: #f59e0b;
        }

        .monitor-stat-value.removed.danger {
            color: #ef4444;
        }

        .monitor-stat-value.removed.normal {
            color: #fff;
        }

        .monitor-stat-value.memory {
            color: #22c55e;
            font-size: 13px;
        }

        .monitor-stat-label {
            font-size: 9px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .monitor-control {
            margin-bottom: 10px;
        }

        .monitor-control label {
            display: block;
            margin-bottom: 4px;
            color: #aaa;
            font-size: 11px;
        }

        .monitor-control input[type="range"] {
            width: 100%;
            margin: 4px 0;
            accent-color: #da7756;
        }

        .monitor-buttons {
            display: flex;
            gap: 8px;
        }

        .monitor-btn {
            flex: 1;
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s;
        }

        .monitor-btn-primary {
            background: #da7756;
            color: #000;
        }

        .monitor-btn-primary:hover {
            background: #c46648;
        }

        .monitor-btn-primary.active {
            background: #16a34a;
            color: #fff;
        }

        .monitor-btn-primary.active:hover {
            background: #15803d;
        }

        .monitor-btn-secondary {
            background: #3b3b3b;
            color: #e0e0e0;
        }

        .monitor-btn-secondary:hover {
            background: #4b4b4b;
        }

        .monitor-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .monitor-warning {
            font-size: 10px;
            color: #f59e0b;
            margin-top: 8px;
            padding: 6px 8px;
            background: rgba(245, 158, 11, 0.1);
            border-radius: 4px;
            line-height: 1.4;
        }

        /* Placeholder for removed messages */
        .claude-monitor-placeholder {
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border: 1px dashed #f59e0b;
            border-radius: 8px;
            padding: 16px;
            margin: 12px 0;
            text-align: center;
            color: #f59e0b;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .claude-monitor-placeholder:hover {
            background: linear-gradient(135deg, #2a2a2a 0%, #333 100%);
            border-color: #fbbf24;
        }

        .claude-monitor-placeholder-icon {
            font-size: 20px;
            margin-bottom: 6px;
        }

        .claude-monitor-placeholder-text {
            font-weight: 500;
        }

        .claude-monitor-placeholder-subtext {
            font-size: 11px;
            color: #888;
            margin-top: 4px;
        }

        /* Toast notification */
        .claude-monitor-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #b8923e;
            color: #000;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 320px;
            animation: monitor-toast-in 0.3s ease-out;
        }

        .claude-monitor-toast-close {
            position: absolute;
            top: 8px;
            right: 10px;
            background: none;
            border: none;
            color: #000;
            font-size: 18px;
            cursor: pointer;
            opacity: 0.6;
        }

        .claude-monitor-toast-close:hover {
            opacity: 1;
        }

        @keyframes monitor-toast-in {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (prefers-color-scheme: light) {
            #claude-monitor-panel {
                background: #efede5;
                border-color: #ccc;
                color: #333;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            }

            .monitor-stats {
                background: #efede5;
            }

            .monitor-stat {
                background: rgba(255,255,255,0.5);
            }

            .monitor-stat-label {
                color: #666;
            }

            .monitor-stat-value {
                color: #000;
            }

            .monitor-stat-value.removed.normal {
                color: #333;
            }

            .monitor-threshold-bar-container,
            .monitor-threshold-bar-container-full {
                background: #ccc;
            }

            .monitor-icon-badge {
                background: #ccc;
                color: #5a9a68;
            }

            .monitor-icon-badge.warning {
                color: #b8923e;
            }

            .monitor-icon-badge.danger {
                color: #b85555;
            }

            .monitor-gear-icon {
                color: #ccc;
            }

            .monitor-minus-icon {
                color: #ccc;
            }

            .monitor-collapse-btn {
                color: #ccc;
            }

            .monitor-collapse-btn:hover {
                color: #999;
            }

            .monitor-control label {
                color: #333;
            }

            .monitor-btn-primary {
                background: #da7756;
                color: #000;
            }

            .monitor-btn-primary:hover {
                background: #c46648;
            }

            .monitor-btn-secondary {
                background: #ccc;
                color: #333;
            }

            .monitor-btn-secondary:hover {
                background: #bbb;
            }

            .monitor-select {
                background: #ccc;
                color: #333;
            }

            .monitor-select:hover {
                background: #bbb;
            }

            .monitor-toggle-row {
                color: #666;
            }

            .monitor-toggle-switch {
                background: #ccc;
            }

            .monitor-warning {
                background: rgba(255,255,255,0.5);
                color: #666;
            }

            .monitor-collapsed-stats {
                color: #888;
            }

            .monitor-collapsed-stats .normal {
                color: #666;
            }

            .monitor-usage-stats {
                color: #888;
            }

            .monitor-usage-bar-container {
                background: #ccc;
            }

            .monitor-usage-label {
                color: #888;
            }

            .monitor-usage-reset {
                color: #666;
            }

            .monitor-usage-sep {
                color: #999;
            }

            .monitor-title {
                color: #333;
            }

            .claude-monitor-toast {
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }
        }
    `;

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Fetch usage data using hidden iframe (fallback method)
    function fetchUsage() {
        // Skip if we have recent stream data (less than 60 seconds old)
        if (lastUsageData && (Date.now() - lastUsageData.timestamp) < 60000) {
            return;
        }

        // Remove any existing iframe
        const existingIframe = document.getElementById('monitor-usage-iframe');
        if (existingIframe) existingIframe.remove();

        const iframe = document.createElement('iframe');
        iframe.id = 'monitor-usage-iframe';
        iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;visibility:hidden;';
        iframe.src = 'https://claude.ai/settings/usage';

        iframe.onload = () => {
            // Wait a moment for React to render
            setTimeout(() => {
                try {
                    const doc = iframe.contentDocument;
                    if (!doc) {
                        console.warn('Claude Monitor: Cannot access iframe document');
                        iframe.remove();
                        return;
                    }

                    // Find all usage sections
                    const sections = doc.querySelectorAll('.w-full.flex.flex-row.gap-x-8');

                    let sessionData = { reset: '—', pct: '—' };
                    let weeklyData = { reset: '—', pct: '—' };

                    sections.forEach(section => {
                        const label = section.querySelector('p.text-text-100');
                        if (!label) return;

                        const labelText = label.textContent.trim();
                        const resetEl = section.querySelector('p.text-text-400:not(.text-right)');
                        const pctEl = section.querySelector('p.text-text-400.text-right');

                        const reset = resetEl ? resetEl.textContent.trim() : '—';
                        const pct = pctEl ? pctEl.textContent.trim().replace(' used', '') : '—';

                        if (labelText === 'Current session') {
                            sessionData = { reset, pct };
                        } else if (labelText === 'All models') {
                            weeklyData = { reset, pct };
                        }
                    });

                    // Only update if we don't have stream data
                    if (!lastUsageData || (Date.now() - lastUsageData.timestamp) > 60000) {
                        // Update UI - Values mode
                        const sessionResetEl = document.getElementById('monitor-session-reset');
                        const sessionPctEl = document.getElementById('monitor-session-pct');
                        const weeklyResetEl = document.getElementById('monitor-weekly-reset');
                        const weeklyPctEl = document.getElementById('monitor-weekly-pct');

                        // Helper to get color class based on percentage
                        const getColorClass = (pctStr) => {
                            const pctNum = parseInt(pctStr, 10);
                            if (isNaN(pctNum)) return '';
                            if (pctNum >= 65) return 'danger';
                            if (pctNum >= 50) return 'warning';
                            return '';
                        };

                        if (sessionResetEl) sessionResetEl.textContent = sessionData.reset.replace('Resets ', '');
                        if (sessionPctEl) {
                            sessionPctEl.textContent = sessionData.pct;
                            sessionPctEl.classList.remove('warning', 'danger');
                            const colorClass = getColorClass(sessionData.pct);
                            if (colorClass) sessionPctEl.classList.add(colorClass);
                        }
                        if (weeklyResetEl) weeklyResetEl.textContent = weeklyData.reset.replace('Resets ', '');
                        if (weeklyPctEl) {
                            weeklyPctEl.textContent = weeklyData.pct;
                            weeklyPctEl.classList.remove('warning', 'danger');
                            const colorClass = getColorClass(weeklyData.pct);
                            if (colorClass) weeklyPctEl.classList.add(colorClass);
                        }

                        // Update UI - Bars mode
                        const sessionBarContainer = document.getElementById('monitor-session-bar-container');
                        const sessionBar = document.getElementById('monitor-session-bar');
                        const weeklyBarContainer = document.getElementById('monitor-weekly-bar-container');
                        const weeklyBar = document.getElementById('monitor-weekly-bar');

                        // Update session bar
                        if (sessionBar && sessionBarContainer) {
                            const pctNum = parseInt(sessionData.pct, 10);
                            sessionBar.style.width = (isNaN(pctNum) ? 0 : pctNum) + '%';
                            sessionBar.classList.remove('warning', 'danger');
                            const colorClass = getColorClass(sessionData.pct);
                            if (colorClass) sessionBar.classList.add(colorClass);
                            const resetText = sessionData.reset.replace('Resets ', '');
                            sessionBarContainer.title = sessionData.pct + ' - Session limit resets ' + resetText;
                        }

                        // Update badge with session usage
                        const iconBadge = document.getElementById('monitor-icon-badge');
                        if (iconBadge) {
                            const pctNum = parseInt(sessionData.pct, 10);
                            iconBadge.textContent = isNaN(pctNum) ? '—' : pctNum + '%';
                            iconBadge.title = isNaN(pctNum) ? 'Token usage: —' : `Token usage: ${pctNum}%`;
                            iconBadge.classList.remove('warning', 'danger');
                            const colorClass = getColorClass(sessionData.pct);
                            if (colorClass) iconBadge.classList.add(colorClass);
                        }

                        // Update weekly bar
                        if (weeklyBar && weeklyBarContainer) {
                            const pctNum = parseInt(weeklyData.pct, 10);
                            weeklyBar.style.width = (isNaN(pctNum) ? 0 : pctNum) + '%';
                            weeklyBar.classList.remove('warning', 'danger');
                            const colorClass = getColorClass(weeklyData.pct);
                            if (colorClass) weeklyBar.classList.add(colorClass);
                            const resetText = weeklyData.reset.replace('Resets ', '');
                            weeklyBarContainer.title = weeklyData.pct + ' - Weekly limit resets ' + resetText;
                        }
                    }

                } catch (e) {
                    console.warn('Claude Monitor: Failed to parse usage iframe', e);
                }

                // Clean up iframe
                iframe.remove();
            }, 2000); // Wait 2 seconds for React to render
        };

        iframe.onerror = () => {
            console.warn('Claude Monitor: Failed to load usage iframe');
            iframe.remove();
        };

        document.body.appendChild(iframe);
    }

    // Show toast notification
    function showToast(message, duration = 30000) {
        // Remove any existing toast
        const existing = document.querySelector('.claude-monitor-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'claude-monitor-toast';
        toast.innerHTML = `
            <button class="claude-monitor-toast-close">×</button>
            ${message}
        `;

        document.body.appendChild(toast);

        const closeBtn = toast.querySelector('.claude-monitor-toast-close');
        closeBtn.addEventListener('click', () => toast.remove());

        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, duration);
    }

    // Check if threshold reached and show alert
    function checkThreshold(removedCount) {
        if (!thresholdAlertShown && removedCount >= newChatThreshold) {
            showToast(`${newChatThreshold} message threshold reached — consider starting a new chat`);
            thresholdAlertShown = true;
        }
    }

    // Find the conversation container and message elements
    function findMessageContainer() {
        // Claude.ai nests messages inside: scroll container > wrapper > inner > message container
        // The message container has classes: flex-1 flex flex-col px-4 max-w-3xl
        const container = document.querySelector('.flex-1.flex.flex-col.px-4.max-w-3xl');
        if (container) return container;

        // Fallback: find via the scroll container path
        const scrollContainer = document.querySelector('.overflow-y-scroll.flex-1');
        if (scrollContainer) {
            const inner = scrollContainer.querySelector('.mx-auto.max-w-3xl');
            if (inner) {
                const msgContainer = inner.querySelector('.flex-1.flex.flex-col');
                if (msgContainer) return msgContainer;
            }
        }

        return null;
    }

    // Get message elements (conversation turns)
    function getMessageElements() {
        const container = findMessageContainer();
        if (!container) return [];

        // Messages are direct DIV children of the container
        // Filter out spacers (h-12 class) and empty/small elements
        const children = Array.from(container.children);

        return children.filter(child => {
            // Skip our placeholder
            if (child.classList.contains('claude-monitor-placeholder')) return false;

            // Skip spacer elements (h-12 class or very small)
            if (child.classList.contains('h-12')) return false;

            // Skip elements with no height (hidden/empty)
            if (child.offsetHeight < 50) return false;

            return true;
        });
    }

    // Estimate memory savings (rough calculation)
    function estimateMemorySaved() {
        let totalChars = 0;
        for (const [id, cached] of removedCache) {
            // cached.messages contains objects with html strings
            for (const msg of cached.messages) {
                totalChars += msg.html.length;
            }
        }
        // Very rough estimate: ~2 bytes per char for DOM + overhead
        const bytes = totalChars * 3;
        if (bytes > 1024 * 1024) {
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        } else if (bytes > 1024) {
            return (bytes / 1024).toFixed(0) + ' KB';
        }
        return bytes + ' B';
    }

    // Prune old messages (actually remove from DOM)
    function pruneMessages() {
        const messages = getMessageElements();
        const total = messages.length;
        const toRemove = Math.max(0, total - keepVisible);

        if (toRemove === 0) {
            updateUI();
            return;
        }

        // Get messages to remove (oldest ones)
        const messagesToRemove = messages.slice(0, toRemove);

        if (messagesToRemove.length === 0) {
            updateUI();
            return;
        }

        // Find insertion point for placeholder (before first remaining message)
        const firstRemaining = messages[toRemove];
        const parent = firstRemaining?.parentNode;

        if (!parent) {
            updateUI();
            return;
        }

        // Check if there's an existing placeholder/cache we need to merge with
        const existingPlaceholder = document.querySelector('.claude-monitor-placeholder');
        let batchId;
        let cachedMessages = [];

        if (existingPlaceholder) {
            // Merge with existing cache
            batchId = parseInt(existingPlaceholder.dataset.cacheId, 10);
            const existingCache = removedCache.get(batchId);
            if (existingCache) {
                cachedMessages = existingCache.messages.slice(); // Copy existing
            }
            existingPlaceholder.remove();
        } else {
            // New batch
            batchId = ++cacheIdCounter;
        }

        // Cache and remove each new message
        for (const msg of messagesToRemove) {
            cachedMessages.push({
                html: msg.outerHTML,
                tagName: msg.tagName,
                className: msg.className
            });
            msg.remove();
        }

        // Store in cache (merged or new)
        removedCache.set(batchId, {
            messages: cachedMessages,
            count: cachedMessages.length,
            parent: parent,
            insertBefore: firstRemaining
        });

        // Create placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'claude-monitor-placeholder';
        placeholder.dataset.cacheId = batchId;
        placeholder.innerHTML = `
            <div class="claude-monitor-placeholder-icon">📦</div>
            <div class="claude-monitor-placeholder-text">
                ${cachedMessages.length} message${cachedMessages.length > 1 ? 's' : ''} removed from DOM
            </div>
            <div class="claude-monitor-placeholder-subtext">
                Click to restore (will re-add to page)
            </div>
        `;

        placeholder.addEventListener('click', () => restoreBatch(batchId));

        parent.insertBefore(placeholder, firstRemaining);

        updateUI();
    }

    // Restore a specific batch of messages
    function restoreBatch(batchId, adjustSlider = true) {
        const cached = removedCache.get(batchId);
        if (!cached) return;

        const placeholder = document.querySelector(`.claude-monitor-placeholder[data-cache-id="${batchId}"]`);
        if (!placeholder) return;

        const parent = placeholder.parentNode;

        // Re-create and insert each message
        for (const msgData of cached.messages.reverse()) {
            const temp = document.createElement('div');
            temp.innerHTML = msgData.html;
            const restored = temp.firstElementChild;

            if (restored) {
                parent.insertBefore(restored, placeholder.nextSibling);
            }
        }

        // Remove placeholder
        placeholder.remove();

        // Clear from cache
        removedCache.delete(batchId);

        // Adjust slider if restored count exceeds keepVisible (only when requested)
        if (adjustSlider) {
            const messages = getMessageElements();
            if (messages.length > keepVisible) {
                keepVisible = messages.length;
                const slider = document.getElementById('monitor-keep-slider');
                const keepValueEl = document.getElementById('monitor-keep-value');

                if (slider) {
                    // Expand slider max if needed
                    if (keepVisible > parseInt(slider.max, 10)) {
                        slider.max = keepVisible + 20;
                    }
                    slider.value = keepVisible;
                }
                if (keepValueEl) {
                    keepValueEl.textContent = keepVisible;
                }
            }
        }

        updateUI();
    }

    // Restore all removed messages
    function restoreAll(adjustSlider = true) {
        // Get all placeholders and restore in order
        const placeholders = document.querySelectorAll('.claude-monitor-placeholder');

        for (const placeholder of placeholders) {
            const batchId = parseInt(placeholder.dataset.cacheId, 10);
            restoreBatch(batchId, false); // Don't adjust slider for each batch
        }

        removedCache.clear();
        thresholdAlertShown = false; // Reset alert since removed count is now 0

        // Adjust slider if restored count exceeds keepVisible (only when requested)
        if (adjustSlider) {
            const messages = getMessageElements();
            if (messages.length > keepVisible) {
                keepVisible = messages.length;
                const slider = document.getElementById('monitor-keep-slider');
                const keepValueEl = document.getElementById('monitor-keep-value');

                if (slider) {
                    // Expand slider max if needed
                    if (keepVisible > parseInt(slider.max, 10)) {
                        slider.max = keepVisible + 20;
                    }
                    slider.value = keepVisible;
                }
                if (keepValueEl) {
                    keepValueEl.textContent = keepVisible;
                }
            }
        }

        updateUI();
    }

    // Toggle auto-pruning
    function toggleEnabled() {
        isEnabled = !isEnabled;

        if (isEnabled) {
            pruneMessages();
            startObserver();
        } else {
            restoreAll(false); // Don't adjust slider when disabling
            stopObserver();
        }

        saveSettings();
        updateUI();
    }

    // MutationObserver for auto-pruning as conversation grows
    let observer = null;
    let debounceTimer = null;

    function startObserver() {
        if (observer) return;

        const container = findMessageContainer();
        if (!container) return;

        observer = new MutationObserver((mutations) => {
            // Debounce to avoid excessive processing
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (isEnabled) {
                    pruneMessages();
                }
                updateUI();
            }, 1000);
        });

        observer.observe(container, {
            childList: true,
            subtree: false // Only watch direct children
        });
    }

    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        clearTimeout(debounceTimer);
    }

    // Update the UI panel
    function updateUI() {
        const messages = getMessageElements();
        const inDOM = messages.length;

        let removedCount = 0;
        for (const [id, cached] of removedCache) {
            removedCount += cached.count;
        }

        const totalEl = document.getElementById('monitor-in-dom');
        const removedEl = document.getElementById('monitor-removed');
        const memoryEl = document.getElementById('monitor-memory');
        const iconToggle = document.getElementById('monitor-icon-toggle');
        const toggleBtn = document.getElementById('monitor-toggle');
        const keepValueEl = document.getElementById('monitor-keep-value');
        const collapsedPctEl = document.getElementById('monitor-collapsed-pct');
        const collapsedRemovedEl = document.getElementById('monitor-collapsed-removed');
        const collapsedThresholdEl = document.getElementById('monitor-collapsed-threshold');
        const thresholdBar = document.getElementById('monitor-threshold-bar');

        if (totalEl) totalEl.textContent = inDOM;
        if (removedEl) {
            removedEl.textContent = removedCount;
            // Update color based on threshold proximity
            removedEl.classList.remove('normal', 'warning', 'danger');
            if (removedCount >= newChatThreshold * 0.65) {
                removedEl.classList.add('danger');
            } else if (removedCount >= newChatThreshold * 0.5) {
                removedEl.classList.add('warning');
            } else {
                removedEl.classList.add('normal');
            }
        }
        if (memoryEl) memoryEl.textContent = removedCount > 0 ? '~' + estimateMemorySaved() : '—';
        if (keepValueEl) keepValueEl.textContent = keepVisible;
        
        // Update collapsed stats - "Chat threshold: X% (y of z used)"
        const collapsedPct = Math.round((removedCount / newChatThreshold) * 100);
        if (collapsedPctEl) {
            collapsedPctEl.textContent = collapsedPct + '%';
            collapsedPctEl.classList.remove('warning', 'danger');
            if (collapsedPct >= 65) {
                collapsedPctEl.classList.add('danger');
            } else if (collapsedPct >= 50) {
                collapsedPctEl.classList.add('warning');
            }
        }
        if (collapsedRemovedEl) collapsedRemovedEl.textContent = removedCount;
        if (collapsedThresholdEl) collapsedThresholdEl.textContent = newChatThreshold;

        // Update threshold progress bar
        if (thresholdBar) {
            const percentage = Math.min((removedCount / newChatThreshold) * 100, 100);
            thresholdBar.style.width = percentage + '%';
            thresholdBar.classList.remove('warning', 'danger');
            if (removedCount >= newChatThreshold * 0.65) {
                thresholdBar.classList.add('danger');
            } else if (removedCount >= newChatThreshold * 0.5) {
                thresholdBar.classList.add('warning');
            }
        }

        // Update bar container tooltip
        const barContainer = document.getElementById('monitor-bar-container');
        if (barContainer) {
            const percentage = Math.round((removedCount / newChatThreshold) * 100);
            barContainer.title = `${percentage}% - Chat threshold: ${removedCount} of ${newChatThreshold} used`;
        }

        if (iconToggle) {
            iconToggle.classList.toggle('disabled', !isEnabled);
        }

        if (toggleBtn) {
            toggleBtn.textContent = isEnabled ? 'Disable' : 'Enable';
            toggleBtn.classList.toggle('active', isEnabled);
        }

        // Check if threshold reached
        checkThreshold(removedCount);
    }

    // Create the control panel
    function createPanel() {
        // Prevent creating duplicate panels
        if (document.getElementById('claude-monitor-panel')) {
            console.log('Claude Monitor: Panel already exists, skipping creation');
            return;
        }

        // Load saved settings first
        const hadSavedSettings = loadSettings();
        const startCollapsed = hadSavedSettings && isEnabled;

        const panel = document.createElement('div');
        panel.id = 'claude-monitor-panel';
        panel.classList.add('placement-' + panelPlacement);
        if (startCollapsed) {
            panel.classList.add('collapsed');
        }

        panel.innerHTML = `
            <div class="monitor-header">
                <span class="monitor-title">
                    <span class="monitor-icon-wrapper">
                        <svg class="monitor-claude-icon ${isEnabled ? '' : 'disabled'}" id="monitor-icon-toggle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#da7756">
                            <title>Enable/disable</title>
                            <path d="m3.127 10.604 3.135-1.76.053-.153-.053-.085H6.11l-.525-.032-1.791-.048-1.554-.065-1.505-.08-.38-.081L0 7.832l.036-.234.32-.214.455.04 1.009.069 1.513.105 1.097.064 1.626.17h.259l.036-.105-.089-.065-.068-.064-1.566-1.062-1.695-1.121-.887-.646-.48-.327-.243-.306-.104-.67.435-.48.585.04.15.04.593.456 1.267.981 1.654 1.218.242.202.097-.068.012-.049-.109-.181-.9-1.626-.96-1.655-.428-.686-.113-.411a2 2 0 0 1-.068-.484l.496-.674L4.446 0l.662.089.279.242.411.94.666 1.48 1.033 2.014.302.597.162.553.06.17h.105v-.097l.085-1.134.157-1.392.154-1.792.052-.504.25-.605.497-.327.387.186.319.456-.045.294-.19 1.23-.37 1.93-.243 1.29h.142l.161-.16.654-.868 1.097-1.372.484-.545.565-.601.363-.287h.686l.505.751-.226.775-.707.895-.585.759-.839 1.13-.524.904.048.072.125-.012 1.897-.403 1.024-.186 1.223-.21.553.258.06.263-.218.536-1.307.323-1.533.307-2.284.54-.028.02.032.04 1.029.098.44.024h1.077l2.005.15.525.346.315.424-.053.323-.807.411-3.631-.863-.872-.218h-.12v.073l.726.71 1.331 1.202 1.667 1.55.084.383-.214.302-.226-.032-1.464-1.101-.565-.497-1.28-1.077h-.084v.113l.295.432 1.557 2.34.08.718-.112.234-.404.141-.444-.08-.911-1.28-.94-1.44-.759-1.291-.093.053-.448 4.821-.21.246-.484.186-.403-.307-.214-.496.214-.98.258-1.28.21-1.016.19-1.263.112-.42-.008-.028-.092.012-.953 1.307-1.448 1.957-1.146 1.227-.274.109-.477-.247.045-.44.266-.39 1.586-2.018.956-1.25.617-.723-.004-.105h-.036l-4.212 2.736-.75.096-.324-.302.04-.496.154-.162 1.267-.871z"/>
                        </svg>
                        <span class="monitor-icon-badge" id="monitor-icon-badge" title="Token usage: —">—</span>
                    </span>
                </span>
                <button class="monitor-collapse-btn" title="Settings">
                        <svg class="monitor-gear-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <title>Settings</title>
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span class="monitor-minus-icon" title="Collapse">−</span>
                    </button>
            </div>
            <div class="monitor-collapsed-stats ${showThresholdBar ? 'show-bar' : ''}" id="monitor-collapsed-stats">
                <span class="monitor-collapsed-numbers">
                    Chat threshold: <span class="monitor-collapsed-pct" id="monitor-collapsed-pct">0%</span> (<span id="monitor-collapsed-removed">0</span> of <span id="monitor-collapsed-threshold">0</span> used)
                </span>
                <span class="monitor-collapsed-bar">
                    <span class="monitor-threshold-bar-container-full" id="monitor-bar-container" title="0% - Chat threshold: 0 of 0 used">
                        <span class="monitor-threshold-bar" id="monitor-threshold-bar"></span>
                    </span>
                </span>
            </div>
            <div class="monitor-usage-stats ${showThresholdBar ? 'show-bar' : ''}" id="monitor-usage-stats">
                <div class="monitor-usage-bars">
                    <div class="monitor-usage-bar-container" id="monitor-session-bar-container" title="—">
                        <div class="monitor-usage-bar" id="monitor-session-bar"></div>
                    </div>
                    <div class="monitor-usage-bar-container" id="monitor-weekly-bar-container" title="—">
                        <div class="monitor-usage-bar" id="monitor-weekly-bar"></div>
                    </div>
                </div>
                <div class="monitor-usage-values">
                    <div class="monitor-usage-row" id="monitor-session-row">
                        Session limit resets <span id="monitor-session-reset">—</span> (<span class="monitor-usage-pct" id="monitor-session-pct">—</span>)
                    </div>
                    <div class="monitor-usage-row" id="monitor-weekly-row">
                        Weekly limit resets <span id="monitor-weekly-reset">—</span> (<span class="monitor-usage-pct" id="monitor-weekly-pct">—</span>)
                    </div>
                </div>
            </div>
            <div class="monitor-content">
                <div class="monitor-stats">
                    <div class="monitor-stat">
                        <div class="monitor-stat-value" id="monitor-in-dom">0</div>
                        <div class="monitor-stat-label">In DOM</div>
                    </div>
                    <div class="monitor-stat">
                        <div class="monitor-stat-value removed" id="monitor-removed">0</div>
                        <div class="monitor-stat-label">Removed</div>
                    </div>
                    <div class="monitor-stat">
                        <div class="monitor-stat-value memory" id="monitor-memory">—</div>
                        <div class="monitor-stat-label">Saved</div>
                    </div>
                </div>
                <div class="monitor-control">
                    <label>Keep in DOM: <strong id="monitor-keep-value">${keepVisible}</strong> messages</label>
                    <input type="range" id="monitor-keep-slider" min="10" max="100" value="${keepVisible}" step="5">
                </div>
                <div class="monitor-control">
                    <label>New chat threshold: <strong id="monitor-threshold-value">${newChatThreshold}</strong></label>
                    <input type="range" id="monitor-threshold-slider" min="50" max="1000" value="${newChatThreshold}" step="25">
                </div>
                <div class="monitor-toggle-row">
                    <span>Bars or values?</span>
                    <div class="monitor-toggle-switch ${showThresholdBar ? 'active' : ''}" id="monitor-bar-toggle" title="Toggle progress bar display"></div>
                </div>
                <div class="monitor-toggle-row">
                    <span>Placement</span>
                    <select id="monitor-placement" class="monitor-select">
                        <option value="top-left" ${panelPlacement === 'top-left' ? 'selected' : ''}>Top Left</option>
                        <option value="top-right" ${panelPlacement === 'top-right' ? 'selected' : ''}>Top Right</option>
                        <option value="bottom-left" ${panelPlacement === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                        <option value="bottom-right" ${panelPlacement === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                    </select>
                </div>
                <div class="monitor-buttons">
                    <button class="monitor-btn monitor-btn-primary ${isEnabled ? 'active' : ''}" id="monitor-toggle">${isEnabled ? 'Disable' : 'Enable'}</button>
                    <button class="monitor-btn monitor-btn-secondary" id="monitor-restore">Restore All</button>
                </div>
                <div class="monitor-warning">
                    ⚠️ Removed messages are cached in JS memory. Restoring re-adds them to the page. Your conversation is preserved server-side.
                </div>
            </div>
        `;

        // Remove any existing panel (safety check)
        const existingPanel = document.getElementById('claude-monitor-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        document.body.appendChild(panel);

        // Click outside to collapse
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !panel.classList.contains('collapsed')) {
                panel.classList.add('collapsed');
            }
        });

        // Prevent clicks inside panel from bubbling
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Event listeners
        const collapseBtn = panel.querySelector('.monitor-collapse-btn');
        const slider = panel.querySelector('#monitor-keep-slider');
        const toggleBtn = panel.querySelector('#monitor-toggle');
        const restoreBtn = panel.querySelector('#monitor-restore');
        const iconToggle = panel.querySelector('#monitor-icon-toggle');
        const barToggle = panel.querySelector('#monitor-bar-toggle');
        const placementSelect = panel.querySelector('#monitor-placement');

        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('collapsed');
        });

        iconToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleEnabled();
        });

        barToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            showThresholdBar = !showThresholdBar;
            barToggle.classList.toggle('active', showThresholdBar);
            const collapsedStats = document.getElementById('monitor-collapsed-stats');
            const usageStats = document.getElementById('monitor-usage-stats');
            if (collapsedStats) {
                collapsedStats.classList.toggle('show-bar', showThresholdBar);
            }
            if (usageStats) {
                usageStats.classList.toggle('show-bar', showThresholdBar);
            }
            saveSettings();
            updateUI();
        });

        placementSelect.addEventListener('change', (e) => {
            e.stopPropagation();
            // Remove old placement class
            panel.classList.remove('placement-top-left', 'placement-top-right', 'placement-bottom-left', 'placement-bottom-right');
            // Add new placement class
            panelPlacement = e.target.value;
            panel.classList.add('placement-' + panelPlacement);
            saveSettings();
        });

        let sliderDebounce = null;

        slider.addEventListener('input', (e) => {
            keepVisible = parseInt(e.target.value, 10);
            document.getElementById('monitor-keep-value').textContent = keepVisible;

            // If enabled, debounce and re-prune
            if (isEnabled) {
                clearTimeout(sliderDebounce);
                sliderDebounce = setTimeout(() => {
                    // First restore all (without adjusting slider), then prune with new count
                    restoreAll(false);
                    pruneMessages();
                    saveSettings();
                }, 250); // Wait for user to stop dragging
            } else {
                // Save even when disabled
                saveSettings();
            }
        });

        const thresholdSlider = panel.querySelector('#monitor-threshold-slider');

        thresholdSlider.addEventListener('input', (e) => {
            newChatThreshold = parseInt(e.target.value, 10);
            document.getElementById('monitor-threshold-value').textContent = newChatThreshold;
            thresholdAlertShown = false; // Reset alert when threshold changes
            saveSettings();
        });

        // Expand slider max if needed for loaded value
        if (keepVisible > 100) {
            slider.max = keepVisible + 20;
        }
        if (newChatThreshold > 1000) {
            thresholdSlider.max = newChatThreshold + 25;
        }

        toggleBtn.addEventListener('click', () => {
            toggleEnabled();
            panel.classList.add('collapsed');
        });
        restoreBtn.addEventListener('click', () => {
            restoreAll();
            panel.classList.add('collapsed');
        });

        // Initial count update with delay to let page settle
        setTimeout(() => {
            updateUI();

            // If was enabled from saved settings, start pruning
            if (isEnabled) {
                pruneMessages();
                startObserver();
            }
        }, 1500);

        // Periodic update for counts - always run to catch late-loading messages
        setInterval(() => {
            // Check if URL changed (switched conversations)
            checkUrlChange();

            // Remove duplicate panels (keep only the first one)
            const panels = document.querySelectorAll('#claude-monitor-panel');
            if (panels.length > 1) {
                for (let i = 1; i < panels.length; i++) {
                    panels[i].remove();
                }
            }

            updateUI();

            // If enabled and messages exist but none pruned yet, try pruning
            if (isEnabled && removedCache.size === 0) {
                const msgs = getMessageElements();
                if (msgs.length > keepVisible) {
                    pruneMessages();
                }
            }
        }, 3000);

        // Fetch usage data initially and every 10 minutes (fallback for when no messages sent)
        fetchUsage();
        setInterval(fetchUsage, 600000); // 10 minutes instead of 5 (stream updates are real-time)
    }

    // Wait for conversation to be present before initializing
    function waitForConversation(callback, maxAttempts = 30) {
        let attempts = 0;

        function check() {
            attempts++;
            const container = findMessageContainer();
            const hasMessages = container && container.children.length > 2;

            if (hasMessages || attempts >= maxAttempts) {
                callback();
            } else {
                setTimeout(check, 500);
            }
        }

        check();
    }

    // Initialize
    function init() {
        // Double-check we're not a duplicate
        if (document.getElementById('claude-monitor-panel')) {
            console.log('Claude Monitor: Panel already exists at init, aborting');
            return;
        }

        // Install fetch interceptor early
        installFetchInterceptor();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => waitForConversation(createPanel));
        } else {
            waitForConversation(createPanel);
        }
    }

    init();
})();