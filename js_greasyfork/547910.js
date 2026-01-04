// ==UserScript==
// @name         Torn Hospital Monitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Monitor hospital status while playing poker
// @author       You
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547910/Torn%20Hospital%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/547910/Torn%20Hospital%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_KEY: 'Putyourapicodehere',
        BASE_URL: 'https://api.torn.com',
        CHECK_INTERVAL: 30000, // 30 seconds
        DEBUG: true,
        ALERT_SETTINGS: {
            VULNERABLE_BEEP_INTERVAL: 3000,    // 3 seconds
            WARNING_BEEP_INTERVAL: 10000,      // 10 seconds
            LOW_TIME_WARNING_MINUTES: 5,       // Warn when <5 minutes left
            BEEP_VOLUME: 0.3,                  // 0.0 to 1.0
            BEEP_FREQUENCY: 800,               // Hz
            BEEP_DURATION: 150                 // milliseconds
        }
    };

    // API Manager
    class TornAPI {
        constructor(apiKey) {
            this.apiKey = apiKey;
            this.lastCall = 0;
            this.rateLimitDelay = 600; // 600ms between calls to stay under 100/minute
        }

        async makeRequest(endpoint, selections = '') {
            // Rate limiting
            const now = Date.now();
            const timeSinceLastCall = now - this.lastCall;
            if (timeSinceLastCall < this.rateLimitDelay) {
                await this.sleep(this.rateLimitDelay - timeSinceLastCall);
            }

            const url = `${CONFIG.BASE_URL}/${endpoint}?key=${this.apiKey}&selections=${selections}`;

            try {
                this.lastCall = Date.now();
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Check for API errors
                if (data.error) {
                    throw new Error(`API Error ${data.error.code}: ${data.error.error}`);
                }

                return data;

            } catch (error) {
                console.error(`API Request failed for ${endpoint}:`, error);
                throw error;
            }
        }

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Get current user's basic info including hospital status
        async getUserStatus() {
            return await this.makeRequest('user', 'basic,profile');
        }

        // Get user's preferences including revive settings
        async getUserPreferences() {
            return await this.makeRequest('user', 'perks,icons,profile');
        }

        // Get basic info about another user (for online status)
        async getOtherUserStatus(userId) {
            return await this.makeRequest(`user/${userId}`, 'basic,profile');
        }
    }

    // Hospital Status Manager
    class HospitalMonitor {
        constructor(api) {
            this.api = api;
            this.currentStatus = null;
            this.lastUpdate = null;
            this.listeners = [];
        }

        // Add event listener for status changes
        onStatusChange(callback) {
            this.listeners.push(callback);
        }

        // Notify all listeners of status change
        notifyListeners(statusData) {
            this.listeners.forEach(callback => {
                try {
                    callback(statusData);
                } catch (error) {
                    console.error('Error in status change listener:', error);
                }
            });
        }

        async checkHospitalStatus() {
            try {
                // Make both API calls every time to get fresh data
                const userData = await this.api.getUserStatus();

                // Debug: Log raw API response to understand structure
                if (CONFIG.DEBUG) {
                    console.log('Raw API Response:', userData);
                }

                // Check multiple possible hospital indicators
                const isInHospital = userData.status?.state === 'Hospital' ||
                                   userData.status?.description?.includes('hospital') ||
                                   userData.states?.hospital_reason ||
                                   userData.status?.details?.includes('hospital');

                // Check revive status from main user data (more reliable)
                let reviveStatus = 'Unknown';
                try {
                    if (userData.revivable !== undefined) {
                        reviveStatus = userData.revivable === 0 ? 'Disabled' : 'Enabled';
                    }
                } catch (error) {
                    console.warn('Error checking revive status:', error);
                }

                const statusData = {
                    inHospital: isInHospital,
                    hospitalTime: userData.status?.description || userData.states?.hospital_reason || null,
                    untilHospitalOut: userData.status?.until ? userData.status.until * 1000 : null, // Convert to milliseconds
                    energy: userData.energy?.current || 0,
                    nerve: userData.nerve?.current || 0,
                    happiness: userData.happy?.current || 0,
                    reviveStatus: reviveStatus,
                    lastUpdate: Date.now(),
                    rawData: userData
                };

                // Enhanced debug logging
                if (CONFIG.DEBUG) {
                    console.log('Hospital Status Check:', {
                        inHospital: statusData.inHospital,
                        status: userData.status,
                        states: userData.states,
                        reason: statusData.hospitalTime,
                        timeRemaining: statusData.untilHospitalOut ?
                            this.formatTimeRemaining(statusData.untilHospitalOut) : 'N/A',
                        reviveStatus: statusData.reviveStatus,
                        energy: statusData.energy,
                        nerve: statusData.nerve,
                        happiness: statusData.happiness
                    });
                }

                // Check if status changed
                const statusChanged = !this.currentStatus ||
                                    this.currentStatus.inHospital !== statusData.inHospital ||
                                    this.currentStatus.untilHospitalOut !== statusData.untilHospitalOut;

                this.currentStatus = statusData;
                this.lastUpdate = Date.now();

                if (statusChanged) {
                    this.notifyListeners(statusData);
                }

                return statusData;

            } catch (error) {
                console.error('Failed to check hospital status:', error);

                // Create error status
                const errorStatus = {
                    error: true,
                    errorMessage: error.message,
                    lastUpdate: Date.now(),
                    staleData: this.currentStatus
                };

                this.notifyListeners(errorStatus);
                return errorStatus;
            }
        }

        formatTimeRemaining(timestamp) {
            if (!timestamp) return 'Unknown';

            const now = Date.now();
            const remaining = timestamp - now;

            if (remaining <= 0) return 'Expired';

            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

            if (hours > 0) {
                return `${hours}h ${minutes}m ${seconds}s`;
            } else if (minutes > 0) {
                return `${minutes}m ${seconds}s`;
            } else {
                return `${seconds}s`;
            }
        }

        getCurrentStatus() {
            return this.currentStatus;
        }

        getLastUpdateTime() {
            return this.lastUpdate;
        }
    }

    // UI Overlay Manager
    class OverlayUI {
        constructor(hospitalMonitor) {
            this.hospitalMonitor = hospitalMonitor;
            this.alertSystem = null; // Will be set externally
            this.overlay = null;
            this.sessionStartTime = Date.now();
            this.totalSafeTime = 0;
            this.lastSafeCheck = Date.now();
            this.isDragging = false;
            this.isResizing = false;
            this.dragStart = { x: 0, y: 0 };
            this.overlayStart = { x: 0, y: 0 };
            this.isMinimized = false;

            this.createOverlay();
            this.setupEventListeners();
        }

        createOverlay() {
            // Create main overlay container
            this.overlay = document.createElement('div');
            this.overlay.id = 'hospital-monitor-overlay';
            this.overlay.innerHTML = `
                <div class="hm-header">
                    <div class="hm-title">🏥 Hospital Monitor</div>
                    <div class="hm-controls">
                        <button class="hm-minimize" title="Minimize">−</button>
                        <button class="hm-close" title="Close">×</button>
                    </div>
                </div>
                <div class="hm-content">
                    <div class="hm-status-section">
                        <div class="hm-hospital-status">
                            <span class="hm-status-icon">🏥</span>
                            <span class="hm-status-text">Checking...</span>
                        </div>
                        <div class="hm-hospital-time">Time: Checking...</div>
                    </div>
                    <div class="hm-divider"></div>
                    <div class="hm-info-section">
                        <div class="hm-revive-status">🔄 Revives: Checking...</div>
                        <div class="hm-alert-status">🔊 Alerts: Active</div>
                        <div class="hm-session-stats">📊 Session: Starting...</div>
                        <div class="hm-last-update">Last update: Never</div>
                        <div class="hm-controls-row">
                            <button class="hm-mute-btn" title="Mute/Unmute alerts">🔊</button>
                            <button class="hm-test-btn" title="Test alert sound">Test</button>
                            <button class="hm-config-btn" title="Settings">⚙️</button>
                        </div>
                    </div>
                </div>
                <div class="hm-resize-handle"></div>
            `;

            // Add styles
            this.addStyles();

            // Add to page
            document.body.appendChild(this.overlay);

            // Load saved position and size
            this.loadPosition();
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #hospital-monitor-overlay {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    width: 280px;
                    min-width: 250px;
                    min-height: 150px;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    border: 2px solid #555;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    color: #fff;
                    z-index: 999999;
                    user-select: none;
                    backdrop-filter: blur(10px);
                    overflow: hidden;
                }

                #hospital-monitor-overlay.minimized {
                    height: auto !important;
                    min-height: auto !important;
                }

                .hm-header {
                    background: linear-gradient(90deg, #333 0%, #444 100%);
                    padding: 8px 12px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    border-bottom: 1px solid #555;
                }

                .hm-title {
                    font-weight: bold;
                    font-size: 13px;
                }

                .hm-controls {
                    display: flex;
                    gap: 5px;
                }

                .hm-controls button {
                    width: 20px;
                    height: 20px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    line-height: 1;
                }

                .hm-minimize {
                    background: #ffa500;
                    color: white;
                }

                .hm-close {
                    background: #ff4444;
                    color: white;
                }

                .hm-content {
                    padding: 12px;
                }

                .hm-content.minimized {
                    display: none;
                }

                .hm-status-section {
                    margin-bottom: 10px;
                }

                .hm-hospital-status {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .hm-status-icon {
                    font-size: 16px;
                }

                .hm-hospital-time {
                    font-size: 12px;
                    color: #ccc;
                    margin-left: 24px;
                }

                .hm-divider {
                    height: 1px;
                    background: #555;
                    margin: 10px 0;
                }

                .hm-info-section {
                    font-size: 11px;
                    color: #bbb;
                }

                .hm-info-section > div {
                    margin-bottom: 4px;
                }

                .hm-controls-row {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                }

                .hm-mute-btn, .hm-test-btn {
                    padding: 4px 8px;
                    border: 1px solid #666;
                    border-radius: 4px;
                    background: #333;
                    color: #fff;
                    cursor: pointer;
                    font-size: 10px;
                }

                .hm-mute-btn:hover, .hm-test-btn:hover, .hm-config-btn:hover {
                    background: #444;
                }

                .hm-config-btn {
                    padding: 4px 8px;
                    border: 1px solid #666;
                    border-radius: 4px;
                    background: #333;
                    color: #fff;
                    cursor: pointer;
                    font-size: 10px;
                }

                .hm-mute-btn.muted {
                    background: #666;
                    color: #ccc;
                }

                .hm-resize-handle {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                    cursor: se-resize;
                    background: linear-gradient(-45deg, transparent 6px, #666 6px);
                }

                /* Status-specific styling */
                .hm-safe {
                    color: #4CAF50 !important;
                }

                .hm-vulnerable {
                    color: #FF4444 !important;
                    animation: pulse 2s infinite;
                }

                .hm-warning {
                    color: #FFA500 !important;
                }

                .hm-error {
                    color: #FF6B6B !important;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* Hover effects */
                .hm-controls button:hover {
                    opacity: 0.8;
                }

                #hospital-monitor-overlay:hover .hm-resize-handle {
                    background: linear-gradient(-45deg, transparent 6px, #888 6px);
                }
            `;
            document.head.appendChild(style);
        }

        setupEventListeners() {
            const header = this.overlay.querySelector('.hm-header');
            const minimizeBtn = this.overlay.querySelector('.hm-minimize');
            const closeBtn = this.overlay.querySelector('.hm-close');
            const resizeHandle = this.overlay.querySelector('.hm-resize-handle');
            const content = this.overlay.querySelector('.hm-content');
            const muteBtn = this.overlay.querySelector('.hm-mute-btn');
            const testBtn = this.overlay.querySelector('.hm-test-btn');
            const configBtn = this.overlay.querySelector('.hm-config-btn');

            // Dragging
            header.addEventListener('mousedown', (e) => {
                if (e.target === minimizeBtn || e.target === closeBtn) return;
                this.startDrag(e);
            });

                // Minimize/maximize
                minimizeBtn.addEventListener('click', () => {
                    this.isMinimized = !this.isMinimized;
                    content.classList.toggle('minimized', this.isMinimized);
                    this.overlay.classList.toggle('minimized', this.isMinimized);
                    minimizeBtn.textContent = this.isMinimized ? '+' : '−';
                    minimizeBtn.title = this.isMinimized ? 'Maximize' : 'Minimize';

                    // Store original height when minimizing
                    if (this.isMinimized) {
                        this.originalHeight = this.overlay.style.height || this.overlay.offsetHeight + 'px';
                        this.overlay.style.height = 'auto';
                    } else {
                        // Restore original height when maximizing
                        if (this.originalHeight) {
                            this.overlay.style.height = this.originalHeight;
                        }
                    }
                });

            // Close
            closeBtn.addEventListener('click', () => {
                this.overlay.style.display = 'none';
            });

            // Resizing
            resizeHandle.addEventListener('mousedown', (e) => {
                this.startResize(e);
                e.stopPropagation();
            });

            // Global mouse events
            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) this.drag(e);
                if (this.isResizing) this.resize(e);
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging || this.isResizing) {
                    this.savePosition();
                }
                this.isDragging = false;
                this.isResizing = false;
            });

            // Hospital status updates
            this.hospitalMonitor.onStatusChange((status) => {
                this.updateDisplay(status);
                // Force alert status refresh
                setTimeout(() => this.updateAlertStatus(), 200);
            });

            // Alert control buttons
            muteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.alertSystem) {
                    const wasMuted = this.alertSystem.isMuted;
                    if (wasMuted) {
                        this.alertSystem.unmute();
                    } else {
                        this.alertSystem.mute();
                    }

                    // Update button immediately
                    const isMuted = this.alertSystem.isMuted;
                    muteBtn.textContent = isMuted ? '🔇' : '🔊';
                    muteBtn.classList.toggle('muted', isMuted);
                    muteBtn.title = isMuted ? 'Unmute alerts' : 'Mute alerts';

                    // Update alert status display
                    setTimeout(() => this.updateAlertStatus(), 100);
                }
            });

            testBtn.addEventListener('click', () => {
                if (this.alertSystem) {
                    this.alertSystem.testVulnerable();
                }
            });

            configBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showConfigPanel();
            });
        }

        startDrag(e) {
            this.isDragging = true;
            this.dragStart.x = e.clientX;
            this.dragStart.y = e.clientY;
            this.overlayStart.x = this.overlay.offsetLeft;
            this.overlayStart.y = this.overlay.offsetTop;
        }

        drag(e) {
            const deltaX = e.clientX - this.dragStart.x;
            const deltaY = e.clientY - this.dragStart.y;
            this.overlay.style.left = (this.overlayStart.x + deltaX) + 'px';
            this.overlay.style.top = (this.overlayStart.y + deltaY) + 'px';
            this.overlay.style.right = 'auto';
        }

        startResize(e) {
            this.isResizing = true;
            this.dragStart.x = e.clientX;
            this.dragStart.y = e.clientY;
            this.overlayStart.width = this.overlay.offsetWidth;
            this.overlayStart.height = this.overlay.offsetHeight;
        }

        resize(e) {
            const deltaX = e.clientX - this.dragStart.x;
            const deltaY = e.clientY - this.dragStart.y;
            const newWidth = Math.max(250, this.overlayStart.width + deltaX);
            const newHeight = Math.max(150, this.overlayStart.height + deltaY);
            this.overlay.style.width = newWidth + 'px';
            this.overlay.style.height = newHeight + 'px';
        }

        updateDisplay(status) {
            const statusText = this.overlay.querySelector('.hm-status-text');
            const timeText = this.overlay.querySelector('.hm-hospital-time');
            const reviveText = this.overlay.querySelector('.hm-revive-status');
            const updateText = this.overlay.querySelector('.hm-last-update');
            const statusIcon = this.overlay.querySelector('.hm-status-icon');
            const alertStatus = this.overlay.querySelector('.hm-alert-status');
            const sessionStats = this.overlay.querySelector('.hm-session-stats');

            // Update session statistics
            this.updateSessionStats(status);

            if (status.error) {
                statusText.textContent = 'API ERROR';
                statusText.className = 'hm-status-text hm-error';
                timeText.textContent = `Error: ${status.errorMessage}`;
                statusIcon.textContent = '⚠️';
            } else if (status.inHospital) {
                statusText.textContent = 'SAFE - In Hospital';
                statusText.className = 'hm-status-text hm-safe';
                timeText.textContent = `Time: ${status.untilHospitalOut ?
                    this.hospitalMonitor.formatTimeRemaining(status.untilHospitalOut) : 'Unknown'}`;
                statusIcon.textContent = '🏥';
            } else {
                statusText.textContent = 'VULNERABLE - Not in Hospital';
                statusText.className = 'hm-status-text hm-vulnerable';
                timeText.textContent = 'Time: Not hospitalized';
                statusIcon.textContent = '⚠️';
            }

            // Update revive status
            if (status.reviveStatus) {
                const reviveColor = status.reviveStatus === 'Disabled' ? 'hm-safe' : 'hm-warning';
                reviveText.innerHTML = `🔄 Revives: <span class="${reviveColor}">${status.reviveStatus}</span>`;
            } else {
                reviveText.textContent = '🔄 Revives: Checking...';
            }

            updateText.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
            this.updateAlertStatus();
        }

        updateSessionStats(status) {
            const sessionStats = this.overlay.querySelector('.hm-session-stats');
            const now = Date.now();

            // Track safe time - only add time if currently safe
            if (status && !status.error && status.inHospital) {
                const timeSinceLastCheck = now - this.lastSafeCheck;
                // Only add time if it's reasonable (not first check or after long gap)
                if (timeSinceLastCheck > 0 && timeSinceLastCheck < 120000) { // Less than 2 minutes
                    this.totalSafeTime += timeSinceLastCheck;
                }
            }
            this.lastSafeCheck = now;

            // Format session duration
            const sessionDuration = now - this.sessionStartTime;
            const sessionMinutes = Math.floor(sessionDuration / (1000 * 60));
            const sessionSeconds = Math.floor((sessionDuration % (1000 * 60)) / 1000);
            const safeMinutes = Math.floor(this.totalSafeTime / (1000 * 60));
            const safePercentage = sessionDuration > 60000 ? // Only calculate % after 1 minute
                Math.round((this.totalSafeTime / sessionDuration) * 100) : 100;

            if (sessionStats) {
                let displayTime = '';
                if (sessionMinutes > 0) {
                    displayTime = `${sessionMinutes}m`;
                } else {
                    displayTime = `${sessionSeconds}s`;
                }
                sessionStats.textContent = `📊 Session: ${displayTime} (${safePercentage}% safe)`;

                // Debug session stats
                if (CONFIG.DEBUG && sessionMinutes % 5 === 0 && sessionSeconds === 0) { // Every 5 minutes
                    console.log('Session Stats:', {
                        totalTime: sessionDuration,
                        safeTime: this.totalSafeTime,
                        sessionMinutes,
                        safeMinutes,
                        safePercentage
                    });
                }
            }
        }

        updateAlertStatus() {
            const alertStatus = this.overlay?.querySelector('.hm-alert-status');
            if (this.alertSystem && alertStatus) {
                let statusText = '';
                let statusClass = 'hm-alert-status';

                if (this.alertSystem.isMuted) {
                    statusText = '🔇 Alerts: Muted';
                    statusClass += ' hm-warning';
                } else if (this.alertSystem.isBeeping && this.alertSystem.alertLevel === 'critical') {
                    statusText = '🚨 Alerts: BEEPING';
                    statusClass += ' hm-vulnerable';
                } else if (this.alertSystem.isBeeping && this.alertSystem.alertLevel === 'warning') {
                    statusText = '⚠️ Alerts: Warning';
                    statusClass += ' hm-warning';
                } else {
                    statusText = '🔊 Alerts: Active';
                }

                alertStatus.textContent = statusText;
                alertStatus.className = statusClass;

                // Also update mute button state
                const muteBtn = this.overlay?.querySelector('.hm-mute-btn');
                if (muteBtn) {
                    muteBtn.textContent = this.alertSystem.isMuted ? '🔇' : '🔊';
                    muteBtn.classList.toggle('muted', this.alertSystem.isMuted);
                    muteBtn.title = this.alertSystem.isMuted ? 'Unmute alerts' : 'Mute alerts';
                }
            }
        }

        setAlertSystem(alertSystem) {
            this.alertSystem = alertSystem;
        }

        showConfigPanel() {
            try {
                // Simple alert-based config for now - could be enhanced later
                const currentInterval = CONFIG.CHECK_INTERVAL / 1000;
                const currentWarningTime = CONFIG.ALERT_SETTINGS.LOW_TIME_WARNING_MINUTES;
                const currentVolume = Math.round(CONFIG.ALERT_SETTINGS.BEEP_VOLUME * 100);

                const newInterval = prompt(
                    `Current check interval: ${currentInterval} seconds\n` +
                    `Enter new interval (10-300 seconds):`,
                    currentInterval
                );

                if (newInterval && !isNaN(newInterval) && newInterval >= 10 && newInterval <= 300) {
                    CONFIG.CHECK_INTERVAL = parseInt(newInterval) * 1000;

                    // Restart monitoring with new interval
                    if (updateInterval) {
                        clearInterval(updateInterval);
                        updateInterval = setInterval(() => {
                            hospitalMonitor.checkHospitalStatus();
                        }, CONFIG.CHECK_INTERVAL);
                    }

                    alert(`✅ Check interval updated to ${newInterval} seconds`);
                }

                const newWarningTime = prompt(
                    `Current warning time: ${currentWarningTime} minutes\n` +
                    `Warn when hospital time remaining is less than (1-60 minutes):`,
                    currentWarningTime
                );

                if (newWarningTime && !isNaN(newWarningTime) && newWarningTime >= 1 && newWarningTime <= 60) {
                    CONFIG.ALERT_SETTINGS.LOW_TIME_WARNING_MINUTES = parseInt(newWarningTime);
                    alert(`✅ Warning time updated to ${newWarningTime} minutes`);
                }
            } catch (error) {
                console.error('Config panel error:', error);
                alert('Settings panel encountered an error. Check console for details.');
            }
        }

        savePosition() {
            const rect = this.overlay.getBoundingClientRect();
            localStorage.setItem('hospitalMonitor_position', JSON.stringify({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            }));
        }

        loadPosition() {
            try {
                const saved = JSON.parse(localStorage.getItem('hospitalMonitor_position') || '{}');
                if (saved.left !== undefined) {
                    this.overlay.style.left = saved.left + 'px';
                    this.overlay.style.top = saved.top + 'px';
                    this.overlay.style.right = 'auto';
                }
                if (saved.width) {
                    this.overlay.style.width = saved.width + 'px';
                }
                if (saved.height) {
                    this.overlay.style.height = saved.height + 'px';
                }
            } catch (error) {
                console.log('No saved position found');
            }
        }

        show() {
            this.overlay.style.display = 'block';
        }

        hide() {
            this.overlay.style.display = 'none';
        }
    }

    // Audio Alert System
    class AlertSystem {
        constructor() {
            this.audioContext = null;
            this.isBeeping = false;
            this.beepInterval = null;
            this.isMuted = false;
            this.alertLevel = 'none'; // none, warning, critical

            this.initializeAudio();
        }

        initializeAudio() {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (error) {
                console.warn('Web Audio API not supported:', error);
            }
        }

        // Create a beep sound using Web Audio API
        createBeep(frequency = CONFIG.ALERT_SETTINGS.BEEP_FREQUENCY,
                   duration = CONFIG.ALERT_SETTINGS.BEEP_DURATION,
                   volume = CONFIG.ALERT_SETTINGS.BEEP_VOLUME) {
            if (!this.audioContext || this.isMuted) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);
        }

        // Different beep patterns
        playVulnerableAlert() {
            // Steady double beep pattern - distinct from poker sounds
            this.createBeep(800, 150, 0.3);
            setTimeout(() => this.createBeep(800, 150, 0.3), 200);
        }

        playWarningAlert() {
            // Single beep for warnings
            this.createBeep(600, 200, 0.2);
        }

        playErrorAlert() {
            // Triple beep for errors
            this.createBeep(1000, 100, 0.4);
            setTimeout(() => this.createBeep(1000, 100, 0.4), 150);
            setTimeout(() => this.createBeep(1000, 100, 0.4), 300);
        }

        startVulnerableBeeping() {
            if (this.isBeeping && this.alertLevel === 'critical') return;

            this.stopBeeping(); // Stop any current beeping
            this.alertLevel = 'critical';
            this.isBeeping = true;

            console.log('🚨 Starting vulnerable alert beeping');

            // Immediate first beep
            this.playVulnerableAlert();

            // Continue beeping every 3 seconds
            this.beepInterval = setInterval(() => {
                this.playVulnerableAlert();
            }, CONFIG.ALERT_SETTINGS.VULNERABLE_BEEP_INTERVAL);
        }

        startWarningBeeping() {
            if (this.isBeeping && this.alertLevel === 'critical') return; // Don't override critical

            if (this.alertLevel === 'warning') return; // Already warning

            this.stopBeeping();
            this.alertLevel = 'warning';
            this.isBeeping = true;

            console.log('⚠️ Starting warning alert beeping');

            // Warning beep every 10 seconds
            this.playWarningAlert();
            this.beepInterval = setInterval(() => {
                this.playWarningAlert();
            }, CONFIG.ALERT_SETTINGS.WARNING_BEEP_INTERVAL);
        }

        stopBeeping() {
            if (this.beepInterval) {
                clearInterval(this.beepInterval);
                this.beepInterval = null;
            }
            this.isBeeping = false;
            this.alertLevel = 'none';
            console.log('🔇 Stopped alert beeping');
        }

        // Handle status changes
        handleStatusChange(status) {
            if (status.error) {
                this.playErrorAlert();
                // Don't start continuous beeping for errors - just one alert
                return;
            }

            if (!status.inHospital) {
                // CRITICAL: Not in hospital - start urgent beeping
                this.startVulnerableBeeping();
            } else if (status.untilHospitalOut) {
                // Check if hospital time is running low
                const timeRemaining = status.untilHospitalOut - Date.now();
                const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));

                if (minutesRemaining <= CONFIG.ALERT_SETTINGS.LOW_TIME_WARNING_MINUTES && minutesRemaining > 0) {
                    // WARNING: Less than 5 minutes left
                    this.startWarningBeeping();
                } else {
                    // SAFE: In hospital with good time remaining
                    this.stopBeeping();
                }
            } else {
                // SAFE: In hospital
                this.stopBeeping();
            }
        }

        // Manual controls
        mute() {
            this.isMuted = true;
            this.stopBeeping();
            console.log('🔇 Alerts muted');
        }

        unmute() {
            this.isMuted = false;
            console.log('🔊 Alerts unmuted');
        }

        toggleMute() {
            if (this.isMuted) {
                this.unmute();
            } else {
                this.mute();
            }
            return this.isMuted;
        }

        // Test functions
        testVulnerable() {
            console.log('Testing vulnerable alert...');
            this.playVulnerableAlert();
        }

        testWarning() {
            console.log('Testing warning alert...');
            this.playWarningAlert();
        }

        testError() {
            console.log('Testing error alert...');
            this.playErrorAlert();
        }
    }

    // Initialize the system
    let api, hospitalMonitor, overlayUI, alertSystem, updateInterval;

    function initialize() {
        console.log('Torn Hospital Monitor - Phase 5 (Fixed v2) Starting...');

        // Initialize API
        api = new TornAPI(CONFIG.API_KEY);

        // Initialize Hospital Monitor
        hospitalMonitor = new HospitalMonitor(api);

        // Initialize Alert System
        alertSystem = new AlertSystem();

        // Initialize UI Overlay
        overlayUI = new OverlayUI(hospitalMonitor);

        // Connect alert system to UI
        overlayUI.setAlertSystem(alertSystem);

        // Add status change listeners
        hospitalMonitor.onStatusChange((status) => {
            // Alert system handling
            alertSystem.handleStatusChange(status);

            // Debug logging (keep existing)
            if (status.error) {
                console.error('❌ Hospital Status Error:', status.errorMessage);
                if (status.staleData) {
                    console.warn('Using stale data:', status.staleData);
                }
            } else {
                console.log('🏥 Hospital Status Update:', {
                    safe: status.inHospital ? '✅ SAFE' : '❌ VULNERABLE',
                    reason: status.hospitalTime,
                    timeLeft: status.untilHospitalOut ?
                        hospitalMonitor.formatTimeRemaining(status.untilHospitalOut) : 'N/A',
                    alertLevel: alertSystem.alertLevel
                });
            }
        });

        // Start monitoring
        startMonitoring();

        console.log('✅ Hospital Monitor with UI and Alerts initialized');
    }

    function startMonitoring() {
        // Initial check
        hospitalMonitor.checkHospitalStatus();

        // Set up recurring checks
        updateInterval = setInterval(() => {
            hospitalMonitor.checkHospitalStatus();
        }, CONFIG.CHECK_INTERVAL);

        console.log(`🔄 Monitoring started - checking every ${CONFIG.CHECK_INTERVAL/1000} seconds`);
    }

    function cleanup() {
        if (updateInterval) {
            clearInterval(updateInterval);
            console.log('🛑 Hospital monitoring stopped');
        }
        if (alertSystem) {
            alertSystem.stopBeeping();
        }
    }

    // Auto-start when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Expose for debugging
    window.TornHospitalMonitor = {
        api,
        hospitalMonitor,
        overlayUI,
        alertSystem,
        checkNow: () => hospitalMonitor?.checkHospitalStatus(),
        getStatus: () => hospitalMonitor?.getCurrentStatus(),
        showUI: () => overlayUI?.show(),
        hideUI: () => overlayUI?.hide(),
        testAlert: () => alertSystem?.testVulnerable(),
        testWarning: () => alertSystem?.testWarning(),
        testError: () => alertSystem?.testError(),
        mute: () => alertSystem?.mute(),
        unmute: () => alertSystem?.unmute(),
        CONFIG
    };

})();