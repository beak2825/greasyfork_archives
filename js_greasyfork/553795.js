// ==UserScript==
// @name         Torn Chain Timer Alert Pro
// @namespace    jke.torn.chain-timer-alert
// @version      3.0
// @description  Advanced chain timer alerts, enhanced animations, sounds, and notifications
// @author       JKE [2409794]
// @license      GNU GPLv3
// @run-at       document-end
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/553795/Torn%20Chain%20Timer%20Alert%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/553795/Torn%20Chain%20Timer%20Alert%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration with defaults
    let config = {
        enabled: true,
        criticalThreshold: 30,     // 30 seconds - REALLY about to lose chain!
        warningThreshold: 90,      // 1.5 minutes - getting dangerous
        cautionThreshold: 180,     // 3 minutes - entering danger zone
        soundEnabled: true,
        browserNotifications: true,
        flashTitle: true,
        statusIndicator: true,
        logHistory: true
    };

    // State variables
    let statusIndicator = null;
    let settingsPanel = null;
    let lastWarningLevel = 0; // 0=none, 1=caution, 2=warning, 3=critical
    let originalTitle = document.title;
    let titleFlashInterval = null;
    let chainHistory = [];

    // Load saved configuration
    function loadConfig() {
        Object.keys(config).forEach(key => {
            const saved = GM_getValue(key);
            if (saved !== undefined) {
                config[key] = saved;
            }
        });
    }

    // Save configuration
    function saveConfig() {
        Object.keys(config).forEach(key => {
            GM_setValue(key, config[key]);
        });
    }

    // Create audio context for alerts
    function createBeep(frequency, duration, type = 'sine') {
        if (!config.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio not supported');
        }
    }

    // Create status indicator as top banner
    function createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'chain-timer-status';
        indicator.style.cssText = `
            position: static;
            width: 100%;
            background: #2c5aa0;
            color: white;
            padding: 8px 0;
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            z-index: 9999;
            cursor: pointer;
            user-select: none;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            border-bottom: 2px solid rgba(255,255,255,0.2);
        `;

        // Add banner animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bannerCritical {
                0% { background: #ff0000; transform: scale(1); }
                50% { background: #ff3333; transform: scale(1.01); }
                100% { background: #ff0000; transform: scale(1); }
            }
            @keyframes bannerWarning {
                0% { background: #ff8800; }
                50% { background: #ffaa22; }
                100% { background: #ff8800; }
            }
            @keyframes bannerCaution {
                0% { background: #ffaa00; }
                50% { background: #ffcc33; }
                100% { background: #ffaa00; }
            }
        `;
        document.head.appendChild(style);

        indicator.innerHTML = '🔗 Chain Timer Alert Pro - Active | Click for Settings';
        indicator.title = 'Chain Timer Alert Pro - Click to open settings';

        indicator.addEventListener('click', toggleSettings);
        indicator.addEventListener('mouseenter', () => {
            indicator.style.background = '#3d6bb3';
        });
        indicator.addEventListener('mouseleave', () => {
            // Will be overridden by updateStatusIndicator anyway
        });

        // Insert at the very beginning of the body (no margin needed for static)
        document.body.insertBefore(indicator, document.body.firstChild);
        return indicator;
    }

    // Update status indicator with enhanced visual alerts
    function updateStatusIndicator(timeLeft, warningLevel) {
        if (!statusIndicator || !config.statusIndicator) return;

        let color = '#2c5aa0'; // Default blue
        let text = '🔗 Chain Timer Alert Pro - Active | Click for Settings';
        let animation = 'none';

        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            const chainCount = getChainCount();

            text = `🔗 Chain: ${chainCount} | Timer: ${timeStr}`;

            switch(warningLevel) {
                case 3:
                    color = '#ff0000';
                    text = `🚨 CHAIN DROPPING IN ${timeStr}! MAKE A HIT NOW! 🚨`;
                    animation = 'bannerCritical 0.5s infinite';
                    break;
                case 2:
                    color = '#ff8800';
                    text = `⚠️ CHAIN DANGER! ${timeStr} remaining - Hit needed soon! ⚠️`;
                    animation = 'bannerWarning 1s infinite';
                    break;
                case 1:
                    color = '#ffaa00';
                    text = `⚡ DANGER ZONE! Chain: ${chainCount} | Timer: ${timeStr} | Getting risky!`;
                    animation = 'bannerCaution 2s infinite';
                    break;
                default:
                    color = '#2c5aa0';
                    text = `🔗 Chain: ${chainCount} | Timer: ${timeStr} | ✅ Safe`;
                    animation = 'none';
            }

            text += ' | Click for Settings';
        }

        statusIndicator.style.background = color;
        statusIndicator.style.animation = animation;
        statusIndicator.innerHTML = text;

        // Update hover color
        statusIndicator.addEventListener('mouseenter', () => {
            const hoverColors = {
                '#ff0000': '#ff3333',
                '#ff8800': '#ffaa22',
                '#ffaa00': '#ffcc33',
                '#2c5aa0': '#3d6bb3'
            };
            statusIndicator.style.background = hoverColors[color] || color;
        });
        statusIndicator.addEventListener('mouseleave', () => {
            statusIndicator.style.background = color;
        });
    }

    // Create settings panel
    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'chain-timer-settings';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #444;
            z-index: 10001;
            min-width: 350px;
            display: none;
            pointer-events: none;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
        `;

        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px; font-size: 18px; font-weight: bold;">
                ⚙️ Chain Timer Settings
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="enabled-check" ${config.enabled ? 'checked' : ''}>
                    Enable Timer Alerts
                </label>
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px;">Critical Alert (seconds):</label>
                <input type="number" id="critical-input" value="${config.criticalThreshold}" min="10" max="300" style="width: 80px; padding: 3px;">
                <span style="color: #ff6666; margin-left: 10px;">🔴 About to lose chain!</span>
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px;">Warning Alert (seconds):</label>
                <input type="number" id="warning-input" value="${config.warningThreshold}" min="60" max="600" style="width: 80px; padding: 3px;">
                <span style="color: #ff8800; margin-left: 10px;">🟠 Getting dangerous</span>
            </div>

            <div style="margin: 10px 0;">
                <label style="display: block; margin-bottom: 5px;">Caution Alert (seconds):</label>
                <input type="number" id="caution-input" value="${config.cautionThreshold}" min="120" max="900" style="width: 80px; padding: 3px;">
                <span style="color: #ffaa00; margin-left: 10px;">🟡 Entering danger zone</span>
            </div>

            <div style="margin: 15px 0;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="sound-check" ${config.soundEnabled ? 'checked' : ''}>
                    Sound Alerts
                </label>
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="notifications-check" ${config.browserNotifications ? 'checked' : ''}>
                    Browser Notifications
                </label>
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="flash-check" ${config.flashTitle ? 'checked' : ''}>
                    Flash Page Title
                </label>
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="status-check" ${config.statusIndicator ? 'checked' : ''}>
                    Show Status Indicator
                </label>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <button id="save-settings" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Save</button>
                <button id="reset-defaults" style="background: #FF9800; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Reset Defaults</button>
                <button id="test-alert" style="background: #2196F3; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Test Alert</button>
                <button id="close-settings" style="background: #f44336; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Close</button>
            </div>

            <div style="margin-top: 15px; font-size: 11px; color: #888; text-align: center;">
                Chain Timer Alert Pro v2.0 | Active: <span id="status-text">${config.enabled ? 'YES' : 'NO'}</span>
            </div>
        `;

        document.body.appendChild(panel);

        // Add event listeners
        panel.querySelector('#save-settings').onclick = saveSettings;
        panel.querySelector('#reset-defaults').onclick = resetDefaults;
        panel.querySelector('#close-settings').onclick = () => {
            panel.style.display = 'none';
            panel.style.pointerEvents = 'none';
        };
        panel.querySelector('#test-alert').onclick = testAlert;

        return panel;
    }

    // Toggle settings panel
    function toggleSettings() {
        if (!settingsPanel) {
            settingsPanel = createSettingsPanel();
        }

        const isHidden = settingsPanel.style.display === 'none';
        settingsPanel.style.display = isHidden ? 'block' : 'none';
        settingsPanel.style.pointerEvents = isHidden ? 'auto' : 'none';
    }

    // Save settings from panel
    function saveSettings() {
        config.enabled = document.getElementById('enabled-check').checked;
        config.criticalThreshold = parseInt(document.getElementById('critical-input').value);
        config.warningThreshold = parseInt(document.getElementById('warning-input').value);
        config.cautionThreshold = parseInt(document.getElementById('caution-input').value);
        config.soundEnabled = document.getElementById('sound-check').checked;
        config.browserNotifications = document.getElementById('notifications-check').checked;
        config.flashTitle = document.getElementById('flash-check').checked;
        config.statusIndicator = document.getElementById('status-check').checked;

        saveConfig();

        // Update status indicator visibility (no margin needed for static positioning)
        if (statusIndicator) {
            statusIndicator.style.display = config.statusIndicator ? 'block' : 'none';
        }

        document.getElementById('status-text').textContent = config.enabled ? 'YES' : 'NO';

        // Show save confirmation
        const saveBtn = document.getElementById('save-settings');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.background = '#4CAF50';
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '#4CAF50';
        }, 1000);
    }

    // Reset to default settings
    function resetDefaults() {
        // Define the default values
        const defaults = {
            enabled: true,
            criticalThreshold: 30,     // 30 seconds - REALLY about to lose chain!
            warningThreshold: 90,      // 1.5 minutes - getting dangerous
            cautionThreshold: 180,     // 3 minutes - entering danger zone
            soundEnabled: true,
            browserNotifications: true,
            flashTitle: true,
            statusIndicator: true,
            logHistory: true
        };

        // Update the form fields
        document.getElementById('enabled-check').checked = defaults.enabled;
        document.getElementById('critical-input').value = defaults.criticalThreshold;
        document.getElementById('warning-input').value = defaults.warningThreshold;
        document.getElementById('caution-input').value = defaults.cautionThreshold;
        document.getElementById('sound-check').checked = defaults.soundEnabled;
        document.getElementById('notifications-check').checked = defaults.browserNotifications;
        document.getElementById('flash-check').checked = defaults.flashTitle;
        document.getElementById('status-check').checked = defaults.statusIndicator;

        // Show reset confirmation
        const resetBtn = document.getElementById('reset-defaults');
        const originalText = resetBtn.textContent;
        const originalColor = resetBtn.style.background;
        resetBtn.textContent = 'Reset!';
        resetBtn.style.background = '#4CAF50';
        setTimeout(() => {
            resetBtn.textContent = originalText;
            resetBtn.style.background = originalColor;
        }, 1000);
    }

    // Test alert function
    function testAlert() {
        createBeep(800, 0.3);
        // Temporarily show critical alert on banner
        const originalLevel = lastWarningLevel;
        lastWarningLevel = 2; // Prevent infinite triggering
        updateStatusIndicator(25, 3); // Show critical for 25 seconds
        setTimeout(() => {
            lastWarningLevel = originalLevel;
            // This will restore normal display on next timer check
        }, 3000);
    }

    // Flash page title
    function flashTitle(message) {
        if (!config.flashTitle) return;

        if (titleFlashInterval) clearInterval(titleFlashInterval);

        let isOriginal = true;
        titleFlashInterval = setInterval(() => {
            document.title = isOriginal ? message : originalTitle;
            isOriginal = !isOriginal;
        }, 1000);
    }

    // Stop title flashing
    function stopTitleFlash() {
        if (titleFlashInterval) {
            clearInterval(titleFlashInterval);
            titleFlashInterval = null;
            document.title = originalTitle;
        }
    }

    // Parse time string (MM:SS) to seconds
    function parseTimeToSeconds(timeStr) {
        if (!timeStr || typeof timeStr !== 'string') return 0;

        const parts = timeStr.trim().split(':');
        if (parts.length !== 2) return 0;

        const minutes = parseInt(parts[0], 10) || 0;
        const seconds = parseInt(parts[1], 10) || 0;

        return (minutes * 60) + seconds;
    }

    // Get chain count
    function getChainCount() {
        const chainElement = document.querySelector('.bar-value___uxnah');
        return chainElement ? chainElement.textContent : 'Unknown';
    }

    // Log chain event
    function logChainEvent(timeLeft, chainCount) {
        if (!config.logHistory) return;

        const event = {
            timestamp: new Date().toISOString(),
            timeLeft: timeLeft,
            chainCount: chainCount,
            warningLevel: lastWarningLevel
        };

        chainHistory.push(event);
        if (chainHistory.length > 100) chainHistory.shift(); // Keep last 100 events

        GM_setValue('chainHistory', JSON.stringify(chainHistory));
    }

    // Check chain timer and trigger alerts
    function checkChainTimer() {
        if (!config.enabled) return;

        const timerElement = document.querySelector('.bar-timeleft___B9RGV');
        if (!timerElement) return;

        const timeText = timerElement.textContent;
        const totalSeconds = parseTimeToSeconds(timeText);
        const chainCount = getChainCount();

        if (totalSeconds <= 0) {
            stopTitleFlash();
            updateStatusIndicator(0, 0);
            return;
        }

        // Determine warning level
        let currentLevel = 0;
        if (totalSeconds <= config.criticalThreshold) currentLevel = 3;
        else if (totalSeconds <= config.warningThreshold) currentLevel = 2;
        else if (totalSeconds <= config.cautionThreshold) currentLevel = 1;

        // Update status indicator
        updateStatusIndicator(totalSeconds, currentLevel);

        // Handle level changes
        if (currentLevel !== lastWarningLevel) {
            if (currentLevel > 0) {
                // Play sound
                if (config.soundEnabled) {
                    switch(currentLevel) {
                        case 3: createBeep(800, 0.5); break;
                        case 2: createBeep(600, 0.3); break;
                        case 1: createBeep(400, 0.2); break;
                    }
                }

                // Browser notification
                if (config.browserNotifications && currentLevel >= 2) {
                    const titles = ['', 'Caution', 'Warning', 'Critical'];
                    GM_notification({
                        text: `Chain timer: ${timeText} remaining!`,
                        title: `${titles[currentLevel]} Alert`,
                        timeout: 5000
                    });
                }

                // Flash title
                if (currentLevel >= 2) {
                    flashTitle(`⚠️ CHAIN: ${timeText} ⚠️`);
                } else {
                    stopTitleFlash();
                }

                // Log event
                logChainEvent(totalSeconds, chainCount);

            } else {
                // Stop title flashing when safe
                stopTitleFlash();
            }

            lastWarningLevel = currentLevel;
        }

        // Style the original timer based on level
        if (currentLevel > 0) {
            const colors = ['', '#ffaa00', '#ff8800', '#ff0000'];
            timerElement.style.color = colors[currentLevel];
            timerElement.style.fontWeight = 'bold';
            timerElement.style.textShadow = `0 0 5px ${colors[currentLevel]}80`;
        } else {
            timerElement.style.color = '';
            timerElement.style.fontWeight = '';
            timerElement.style.textShadow = '';
        }
    }

    // Initialize the script
    function initialize() {
        // Load configuration
        loadConfig();

        // Load chain history
        const savedHistory = GM_getValue('chainHistory');
        if (savedHistory) {
            try {
                chainHistory = JSON.parse(savedHistory);
            } catch (e) {
                chainHistory = [];
            }
        }

        // Create status indicator
        if (config.statusIndicator) {
            statusIndicator = createStatusIndicator();
        }

        // Start monitoring
        setInterval(checkChainTimer, 1000);

        // Set up mutation observer
        const observer = new MutationObserver(checkChainTimer);
        const targetNode = document.querySelector('.bar-stats___E_LqA') || document.body;
        observer.observe(targetNode, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Initial check
        setTimeout(checkChainTimer, 1000);

        console.log('✅ Chain Timer Alert Pro ready!');
        console.log(`📊 Settings: ${config.enabled ? 'Enabled' : 'Disabled'} | Critical: ${config.criticalThreshold}s | Warning: ${config.warningThreshold}s | Caution: ${config.cautionThreshold}s`);
    }

    // Start when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 1000);
    }

})();