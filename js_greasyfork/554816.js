// ==UserScript==
// @name         LincolnLawyer's IQRPG SoundMaster Pro
// @namespace    https://www.iqrpg.com/lincolnlawyer/
// @version      3.9.9
// @description  SIMPLE FIX: Emergency stop on chat channel clicks
// @author       LincolnLawyer
// @match        http://iqrpg.com/game.html
// @match        https://iqrpg.com/game.html
// @match        http://www.iqrpg.com/game.html
// @match        https://www.iqrpg.com/game.html
// @match        http://test.iqrpg.com/game.html
// @match        https://test.iqrpg.com/game.html
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @grant        GM_notification
// @homepageURL  https://greasyfork.org/en/scripts/554816-lincolnlawyer-s-iqrpg-soundmaster-pro/code
// @supportURL   https://greasyfork.org/en/scripts/554816-lincolnlawyer-s-iqrpg-soundmaster-pro/code
// @downloadURL https://update.greasyfork.org/scripts/554816/LincolnLawyer%27s%20IQRPG%20SoundMaster%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554816/LincolnLawyer%27s%20IQRPG%20SoundMaster%20Pro.meta.js
// ==/UserScript==

/* ════════════════════════════════════════════════════════════════════════
   Copyright Notice & License

   LincolnLawyer's IQRPG SoundMaster Pro v3.9.9
   Copyright (c) 2024 LincolnLawyer. All rights reserved.

   This script is protected by copyright law. Redistribution, modification,
   or claiming this code as your own is strictly prohibited without
   explicit written permission from the original author.

   This work is licensed under the Creative Commons Attribution-NonCommercial 4.0
   International License. To view a copy of this license, visit:
   http://creativecommons.org/licenses/by-nc/4.0/
   ════════════════════════════════════════════════════════════════════════ */

(function() {
    'use strict';

    console.log("🎵 LincolnLawyer's IQRPG SoundMaster Pro v3.9.9 - SIMPLE CHAT FIX!");

    // ==================== CONFIGURATION ====================
    let SOUNDS_ENABLED = true; // Made these variables so they can be toggled
    let NOTIFICATIONS_ENABLED = true;
    let MASTER_VOLUME = 1.0;

    const NOTIFICATION_DURATION = 5;
    const FLASH_TAB_ON_NOTIFY = true;
    const AUTO_ENABLE_NOTIFICATIONS = true;

    const AUTO_ALERTS_ENABLED = true;
    const AUTO_ALERT_AT_COUNT = 10;
    const DUNGEON_ALERTS_ENABLED = true;
    const BOSS_ALERTS_ENABLED = true;
    const WHISPER_ALERTS_ENABLED = true;
    const EVENT_ALERTS_ENABLED = true;
    const LAND_ALERTS_ENABLED = true;
    const MASTERY_ALERTS_ENABLED = true;
    const EFFECT_ALERTS_ENABLED = true;
    const WATCHTOWER_ALERTS_ENABLED = true;
    const BONUS_EXP_ALERTS_ENABLED = true;

    const DEBUG_MODE = false;

    // ==================== STATE VARIABLES ====================
    let alertInterval = null;
    let isAlerting = false;
    let notificationCooldown = false;
    let bonusExpActive = false;
    let whisperCooldown = false;
    let emergencyStopActive = false;
    let controlPanel = null;
    let isPanelMinimized = false;
    let originalTitle = document.title;
    let flashInterval = null;
    let lastLandAlertTime = 0;
    let lastWatchtowerAlertTime = 0;
    let lastAutoAlertTime = 0;
    let hasAlertedForCurrentLowAutos = false;
    let lastAutoCount = null;
    let autoDetectionActive = false;
    let notificationsPermission = 'default';

    let activeAudioElements = [];
    let testSoundTimeouts = [];
    let isTestRunning = false;
    let testButtonClicked = false;
    let isChatClickInProgress = false;

    // ==================== SOUND URLs ====================
    const SOUND_URLS = {
        auto: 'https://www.myinstants.com/media/sounds/bell-ringing-05.mp3',
        dungeon: 'https://www.myinstants.com/media/sounds/tada.mp3',
        bossSpawn: 'https://www.myinstants.com/media/sounds/dramatic-sound-effect.mp3',
        bossDefeat: 'https://www.myinstants.com/media/sounds/victoryff.mp3',
        whisper: 'https://www.myinstants.com/media/sounds/discord-notification.mp3',
        eventStart: 'https://www.myinstants.com/media/sounds/minecraft-xp-sound.mp3',
        eventEnd: 'https://www.myinstants.com/media/sounds/finish-him.mp3',
        land: 'https://www.myinstants.com/media/sounds/cha-ching.mp3',
        mastery: 'https://www.myinstants.com/media/sounds/mlg-airhorn.mp3',
        effect: 'https://www.myinstants.com/media/sounds/windows-error.mp3',
        watchtower: 'https://www.myinstants.com/media/sounds/alarm.mp3',
        bonusExp: 'https://www.myinstants.com/media/sounds/coin.mp3'
    };

    // ==================== CORE FUNCTIONS ====================

    function setupChatClickHandler() {
        console.log('💬 Setting up chat click handler...');

        document.addEventListener('click', function(event) {
            if (isChatClickInProgress) return;

            const target = event.target;
            if (!target) return;

            const text = (target.textContent || '').toLowerCase();
            const className = (target.className || '').toLowerCase();

            const isChatClick = (
                text.includes('clan') ||
                text.includes('global') ||
                text.includes('main') ||
                text.includes('whisper') ||
                text.includes('pm') ||
                text.includes('event') ||
                text.includes('chat') ||
                text.includes('channel') ||
                text.includes('tab') ||
                className.includes('clan') ||
                className.includes('global') ||
                className.includes('main') ||
                className.includes('whisper') ||
                className.includes('pm') ||
                className.includes('event') ||
                className.includes('chat') ||
                className.includes('channel') ||
                className.includes('tab') ||
                (target.parentElement && (
                    (target.parentElement.textContent || '').toLowerCase().includes('clan') ||
                    (target.parentElement.textContent || '').toLowerCase().includes('global') ||
                    (target.parentElement.textContent || '').toLowerCase().includes('main') ||
                    (target.parentElement.textContent || '').toLowerCase().includes('whisper') ||
                    (target.parentElement.textContent || '').toLowerCase().includes('chat')
                ))
            );

            if (isChatClick) {
                if (DEBUG_MODE) console.log('💬 Chat channel clicked:', text.substring(0, 50));

                isChatClickInProgress = true;
                const wasEmergencyStopActive = emergencyStopActive;
                emergencyStopActive = true;
                stopAllSounds();

                setTimeout(() => {
                    emergencyStopActive = wasEmergencyStopActive;
                    isChatClickInProgress = false;
                    if (DEBUG_MODE) console.log('💬 Chat click handling complete');
                }, 100);
            }
        }, true);

        console.log('✅ Chat click handler active');
    }

    function playSound(soundType) {
        if (!SOUNDS_ENABLED || emergencyStopActive) {
            if (DEBUG_MODE) console.log('🔇 Sound blocked');
            return null;
        }

        activeAudioElements = activeAudioElements.filter(audio =>
            !audio.ended && !audio.error
        );

        const soundURL = SOUND_URLS[soundType];
        if (!soundURL) return null;

        try {
            const audio = new Audio(soundURL);
            audio.volume = MASTER_VOLUME;

            activeAudioElements.push(audio);

            audio.addEventListener('ended', function() {
                const index = activeAudioElements.indexOf(audio);
                if (index > -1) activeAudioElements.splice(index, 1);
            });

            audio.addEventListener('error', function() {
                const index = activeAudioElements.indexOf(audio);
                if (index > -1) activeAudioElements.splice(index, 1);
            });

            audio.play().catch(e => {
                if (DEBUG_MODE) console.log('Audio play failed:', e);
                const index = activeAudioElements.indexOf(audio);
                if (index > -1) activeAudioElements.splice(index, 1);
            });

            if (DEBUG_MODE) console.log(`🔊 Playing sound: ${soundType}`);
            return audio;
        } catch (error) {
            if (DEBUG_MODE) console.log('Error playing sound:', error);
            return null;
        }
    }

    function stopAllSounds() {
        console.log('🔇 EMERGENCY STOP - Killing all sounds');

        activeAudioElements.forEach(audio => {
            try {
                audio.pause();
                audio.currentTime = 0;
                audio.src = '';
            } catch (e) {}
        });

        activeAudioElements.length = 0;

        testSoundTimeouts.forEach(timeout => {
            clearTimeout(timeout);
            clearInterval(timeout);
        });
        testSoundTimeouts.length = 0;

        if (alertInterval) {
            clearInterval(alertInterval);
            alertInterval = null;
        }

        isTestRunning = false;
        testButtonClicked = false;

        if (flashInterval) {
            clearInterval(flashInterval);
            flashInterval = null;
            document.title = originalTitle;
        }

        hasAlertedForCurrentLowAutos = false;
        lastAutoAlertTime = 0;
        lastAutoCount = null;
        autoDetectionActive = false;
        isAlerting = false;
    }

    function showNotification(title, body) {
        if (!NOTIFICATIONS_ENABLED || emergencyStopActive) return;

        if (DEBUG_MODE) console.log(`🔔 Notification: ${title} - ${body}`);

        const permission = "Notification" in window ? Notification.permission : "unsupported";

        if (permission === "granted") {
            showBrowserNotification(title, body);
        } else if (permission === "default") {
            showFallbackNotification(title, body);
        } else {
            showFallbackNotification(title, body);
        }
    }

    function showBrowserNotification(title, body) {
        if (notificationCooldown) return;
        notificationCooldown = true;

        try {
            const notification = new Notification(title, {
                body: body,
                icon: 'https://www.iqrpg.com/favicon.ico',
                requireInteraction: false
            });

            notification.onclick = function() {
                window.focus();
                this.close();
                stopFlashingTab();
            };

            notification.onclose = function() {
                notificationCooldown = false;
            };

            if (FLASH_TAB_ON_NOTIFY && !document.hasFocus()) {
                flashTab(title);
            }

            setTimeout(() => {
                notification.close();
                notificationCooldown = false;
            }, NOTIFICATION_DURATION * 1000);

        } catch (error) {
            console.error('🔔 Notification error:', error);
            notificationCooldown = false;
            showFallbackNotification(title, body);
        }
    }

    function showFallbackNotification(title, body) {
        console.log(`📢 ${title}: ${body}`);

        if (typeof GM_notification !== 'undefined') {
            try {
                GM_notification({
                    text: body,
                    title: title,
                    timeout: NOTIFICATION_DURATION * 1000,
                    onclick: function() { window.focus(); }
                });
                return;
            } catch (e) {}
        }

        showOnScreenNotification(title, body);
    }

    function showOnScreenNotification(title, body) {
        $('.soundmaster-on-screen-notification').remove();

        const notification = $(`
            <div class="soundmaster-on-screen-notification">
                <div class="notification-title">${title}</div>
                <div class="notification-body">${body}</div>
            </div>
        `).appendTo('body');

        setTimeout(() => {
            notification.fadeOut(500, function() {
                $(this).remove();
            });
        }, NOTIFICATION_DURATION * 1000);

        notification.click(function() {
            $(this).fadeOut(300, function() {
                $(this).remove();
            });
        });
    }

    function flashTab(title) {
        if (flashInterval) clearInterval(flashInterval);

        let flashOn = false;
        flashInterval = setInterval(() => {
            flashOn = !flashOn;
            document.title = flashOn ? `🔔 ${title}` : originalTitle;
        }, 1000);

        window.addEventListener('focus', stopFlashingTab, { once: true });
        setTimeout(stopFlashingTab, 10000);
    }

    function stopFlashingTab() {
        if (flashInterval) {
            clearInterval(flashInterval);
            flashInterval = null;
            document.title = originalTitle;
        }
    }

    function autoEnableNotifications() {
        if (!AUTO_ENABLE_NOTIFICATIONS || !NOTIFICATIONS_ENABLED) return;

        console.log('🔔 Auto-enabling notifications...');

        if ("Notification" in window) {
            notificationsPermission = Notification.permission;

            if (notificationsPermission === "default") {
                setTimeout(() => {
                    Notification.requestPermission().then(permission => {
                        notificationsPermission = permission;
                        if (permission === "granted") {
                            showNotification('🔔 Notifications Enabled!', 'Desktop notifications are now active!');
                            updateControlPanel();
                        }
                    });
                }, 3000);
            }
        }
    }

    function enableNotificationsManually() {
        if (!("Notification" in window)) {
            alert('❌ Browser does not support notifications.');
            return;
        }

        if (Notification.permission === "granted") {
            showNotification('🔔 Already Enabled', 'Notifications are already enabled!');
            return;
        }

        if (Notification.permission === "denied") {
            alert('❌ Notifications were blocked. Enable in browser settings.');
            return;
        }

        Notification.requestPermission().then(permission => {
            notificationsPermission = permission;
            if (permission === "granted") {
                showNotification('🎉 Notifications Enabled!', 'You will receive desktop notifications!');
                updateControlPanel();
            }
        });
    }

    function checkAutoCountInText(text) {
        if (!AUTO_ALERTS_ENABLED || emergencyStopActive || autoDetectionActive) return;
        if (!text || text.length < 3 || text.length > 50) return;

        const autoPatterns = [
            /autos?\s*[:\-]\s*(\d+)/i,
            /(\d+)\s*\/\s*\d+\s*autos?/i,
            /auto\s*battles?\s*[:\-]\s*(\d+)/i,
            /actions?\s*[:\-]\s*(\d+)/i,
            /(\d+)\s*autos?/i,
            /autos?\s*\((\d+)\)/i
        ];

        let foundCount = null;
        for (const pattern of autoPatterns) {
            const match = text.match(pattern);
            if (match) {
                foundCount = parseInt(match[1] || match[0]);
                break;
            }
        }

        if (foundCount !== null) {
            if (DEBUG_MODE) console.log(`🎯 Auto count detected: ${foundCount}`);

            if (lastAutoCount !== null && foundCount === lastAutoCount) return;
            lastAutoCount = foundCount;

            if (foundCount <= AUTO_ALERT_AT_COUNT) {
                if (!hasAlertedForCurrentLowAutos) {
                    triggerAutoAlert();
                }
            } else if (hasAlertedForCurrentLowAutos) {
                hasAlertedForCurrentLowAutos = false;
                lastAutoAlertTime = 0;
                isAlerting = false;
            }

            updateControlPanel();
        }
    }

    function triggerAutoAlert() {
        if (emergencyStopActive || !AUTO_ALERTS_ENABLED) return;

        const now = Date.now();
        if (hasAlertedForCurrentLowAutos && (now - lastAutoAlertTime < 60000)) return;

        isAlerting = true;
        lastAutoAlertTime = now;
        hasAlertedForCurrentLowAutos = true;

        if (DEBUG_MODE) console.log('🔔 Triggering auto alert');

        playSound('auto');
        showNotification('⚔️ Low on Autos!', `Only ${AUTO_ALERT_AT_COUNT} or fewer autos remaining!`);

        updateControlPanel();

        setTimeout(() => isAlerting = false, 2000);
        setTimeout(() => hasAlertedForCurrentLowAutos = false, 120000);
    }

    function toggleEmergencyStop() {
        emergencyStopActive = !emergencyStopActive;

        if (emergencyStopActive) {
            stopAllSounds();
            showNotification('🔇 Emergency Stop', 'All sounds killed, alerts disabled.');
        } else {
            showNotification('🔔 Alerts Re-enabled', 'All alerts have been re-enabled.');
        }

        updateControlPanel();
    }

    function toggleSounds() {
        SOUNDS_ENABLED = !SOUNDS_ENABLED;
        const status = SOUNDS_ENABLED ? 'enabled' : 'disabled';
        showNotification('SoundMaster', `Sounds ${status}`);
        updateControlPanel();
    }

    function toggleNotifications() {
        NOTIFICATIONS_ENABLED = !NOTIFICATIONS_ENABLED;
        const status = NOTIFICATIONS_ENABLED ? 'enabled' : 'disabled';
        showNotification('SoundMaster', `Notifications ${status}`);
        updateControlPanel();
    }

    function adjustVolume(change) {
        const oldVolume = MASTER_VOLUME;
        MASTER_VOLUME = Math.max(0, Math.min(2, MASTER_VOLUME + change));

        // Update all active audio elements
        activeAudioElements.forEach(audio => {
            audio.volume = MASTER_VOLUME;
        });

        if (MASTER_VOLUME !== oldVolume) {
            showNotification('SoundMaster', `Volume: ${Math.round(MASTER_VOLUME * 100)}%`);
            updateControlPanel();
        }
    }

    function testAllSounds() {
        if (!testButtonClicked) return;

        console.log("🎵 QUICK TEST - Playing sample sounds...");

        testSoundTimeouts.forEach(timeout => clearTimeout(timeout));
        testSoundTimeouts.length = 0;

        isTestRunning = false;
        stopAllSounds();
        isTestRunning = true;

        const quickTestSounds = [
            { type: 'auto', name: 'Auto Battle Alert', delay: 0 },
            { type: 'dungeon', name: 'Dungeon Complete', delay: 1000 },
            { type: 'whisper', name: 'Whisper Received', delay: 2000 }
        ];

        quickTestSounds.forEach(sound => {
            const timeout = setTimeout(() => {
                if (!isTestRunning || emergencyStopActive) return;
                playSound(sound.type);
                showNotification('🎵 Quick Test', sound.name);
            }, sound.delay);
            testSoundTimeouts.push(timeout);
        });

        const stopTimeout = setTimeout(() => {
            isTestRunning = false;
            testButtonClicked = false;
            showNotification('✅ Quick Test Complete', 'Test finished successfully!');
        }, 3000);
        testSoundTimeouts.push(stopTimeout);

        showNotification('🎵 Quick Test Started', 'Testing 3 sounds over 3 seconds...');
    }

    function manualTestButtonClick() {
        console.log("✅ Test button clicked");
        testButtonClicked = true;
        testAllSounds();

        setTimeout(() => testButtonClicked = false, 4000);
    }

    function scanElementForAlerts(element) {
        if (!element || !element.textContent || emergencyStopActive) return;

        const text = element.textContent.toLowerCase();

        if (text.includes('test') || text.includes('testing') || text.includes('quick test')) return;

        // Watchtower alerts
        if (WATCHTOWER_ALERTS_ENABLED) {
            const isWatchtowerAlert = (
                (text.includes('watchtower') && (text.includes('spotted') || text.includes('sighted'))) ||
                (text.includes('enemy') && text.includes('sighted') && text.includes('clan'))
            );

            if (isWatchtowerAlert && Date.now() - lastWatchtowerAlertTime > 10000) {
                lastWatchtowerAlertTime = Date.now();
                playSound('watchtower');
                showNotification('🏰 Clan Watchtower', 'Enemy activity detected!');
            }
        }

        // Boss alerts
        if (BOSS_ALERTS_ENABLED && text.includes('boss')) {
            if (text.includes('spawn') || text.includes('appear')) {
                playSound('bossSpawn');
                showNotification('👹 Boss Spawned!', 'A boss has appeared!');
            } else if (text.includes('defeat') || text.includes('kill')) {
                playSound('bossDefeat');
                showNotification('🎉 Boss Defeated!', 'The boss has been defeated!');
            }
        }

        // Dungeon alerts
        if (DUNGEON_ALERTS_ENABLED && text.includes('dungeon') &&
            (text.includes('complete') || text.includes('finish'))) {
            playSound('dungeon');
            showNotification('🏰 Dungeon Complete!', 'Your dungeon run is finished!');
        }

        // Mastery alerts
        if (MASTERY_ALERTS_ENABLED && text.includes('mastery')) {
            const levelMatch = text.match(/level\s+(\d+)/);
            if (levelMatch && parseInt(levelMatch[1]) % 50 === 0) {
                playSound('mastery');
                showNotification('🌟 Mastery Milestone!', `Reached level ${levelMatch[1]}!`);
            }
        }

        // Whisper alerts
        if (WHISPER_ALERTS_ENABLED && !whisperCooldown &&
            (text.includes('whisper') || text.includes('pm'))) {
            const usernameMatch = text.match(/from\s+(\w+)/i);
            if (usernameMatch) {
                playSound('whisper');
                showNotification('💬 Whisper Received', `Message from ${usernameMatch[1]}`);
                whisperCooldown = true;
                setTimeout(() => whisperCooldown = false, 5000);
            }
        }

        // Check child elements
        if (element.children) {
            for (let i = 0; i < element.children.length; i++) {
                scanElementForAlerts(element.children[i]);
            }
        }
    }

    function setupMutationObservers() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1) {
                            scanElementForAlerts(node);
                        }
                    }
                }

                if (mutation.type === 'characterData') {
                    const text = mutation.target.data;
                    if (text && text.length > 2 && text.length < 100) {
                        checkAutoCountInText(text);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            characterData: true,
            subtree: true
        });

        // Periodic scan for auto counts
        setInterval(function() {
            const battleElements = document.querySelectorAll(
                'div.action-timer__text, div[class*="battle"], div[class*="auto"], ' +
                'span[class*="battle"], span[class*="auto"], #battlePanel, #autoPanel'
            );

            battleElements.forEach(element => {
                const text = element.textContent?.trim();
                if (text && text.length > 2 && text.length < 100) {
                    checkAutoCountInText(text);
                }
            });
        }, 10000);
    }

    // ==================== CONTROL PANEL ====================

    function createControlPanel() {
        $('#soundmaster-panel').remove();
        $('#soundmaster-reopen').remove();

        controlPanel = $(`
            <div id="soundmaster-panel" class="soundmaster-panel">
                <div class="panel-header">
                    <span class="panel-title">🎵 SoundMaster v3.9.9</span>
                    <div class="header-buttons">
                        <button id="panel-minimize" class="header-btn minimize-btn">−</button>
                        <button id="panel-close" class="header-btn close-btn">×</button>
                    </div>
                </div>

                <div class="panel-content">
                    <div class="status-display">
                        <div class="status-row">
                            <span class="status-label">Sounds:</span>
                            <span id="status-sounds" class="status-value status-on">ON</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">Notifications:</span>
                            <span id="status-notify" class="status-value status-off">OFF</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">Emergency Stop:</span>
                            <span id="status-emergency" class="status-value status-off">OFF</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">Volume:</span>
                            <span id="status-volume" class="status-value">100%</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">Chat Protection:</span>
                            <span id="status-chat-protection" class="status-value status-on">ACTIVE</span>
                        </div>
                    </div>

                    <div class="button-row">
                        <button id="btn-test" class="control-btn test-btn">🎵 Quick Test (3s)</button>
                        <button id="btn-emergency" class="control-btn emergency-btn">🚨 Emergency Stop</button>
                    </div>

                    <div class="button-row">
                        <button id="btn-toggle-sounds" class="toggle-btn">🔊 Toggle Sounds</button>
                        <button id="btn-toggle-notify" class="toggle-btn">📢 Toggle Notify</button>
                    </div>

                    <div class="button-row">
                        <button id="btn-enable-notifications" class="control-btn notification-btn">🔔 Enable Notifications</button>
                    </div>

                    <div class="volume-controls">
                        <button id="btn-volume-down" class="volume-btn">🔉 Vol-</button>
                        <div class="volume-slider-container">
                            <div class="volume-slider-track">
                                <div id="volume-slider" class="volume-slider" style="width: 100%"></div>
                            </div>
                        </div>
                        <button id="btn-volume-up" class="volume-btn">🔊 Vol+</button>
                    </div>

                    <div class="debug-info">
                        <small>Active Sounds: <span id="active-sounds-count">0</span> | Test: <span id="test-status">IDLE</span> | Notifications: <span id="notification-status">Checking...</span></small>
                    </div>
                </div>
            </div>
        `).appendTo('body');

        $(`
            <button id="soundmaster-reopen" class="soundmaster-reopen">
                🎵
            </button>
        `).appendTo('body').hide();

        setupControlPanelEvents();
        updateControlPanel();

        setInterval(updatePanelStatus, 500);

        return controlPanel;
    }

    function setupControlPanelEvents() {
        $('#panel-minimize').click(function(e) {
            e.stopPropagation();
            togglePanelMinimize();
        });

        $('#panel-close').click(function(e) {
            e.stopPropagation();
            controlPanel.hide();
            $('#soundmaster-reopen').show();
        });

        $('#btn-test').click(function(e) {
            e.stopPropagation();
            manualTestButtonClick();
        });

        $('#btn-emergency').click(function(e) {
            e.stopPropagation();
            toggleEmergencyStop();
        });

        $('#btn-toggle-sounds').click(function(e) {
            e.stopPropagation();
            toggleSounds();
        });

        $('#btn-toggle-notify').click(function(e) {
            e.stopPropagation();
            toggleNotifications();
        });

        $('#btn-enable-notifications').click(function(e) {
            e.stopPropagation();
            enableNotificationsManually();
        });

        $('#btn-volume-down').click(function(e) {
            e.stopPropagation();
            adjustVolume(-0.1);
        });

        $('#btn-volume-up').click(function(e) {
            e.stopPropagation();
            adjustVolume(0.1);
        });

        $('.volume-slider-track').click(function(e) {
            e.stopPropagation();
            const trackWidth = $(this).width();
            const clickX = e.pageX - $(this).offset().left;
            const newVolume = Math.max(0, Math.min(2, (clickX / trackWidth) * 2));

            // Calculate the difference and adjust
            const volumeChange = newVolume - MASTER_VOLUME;
            adjustVolume(volumeChange);
        });

        $('#soundmaster-reopen').click(function(e) {
            e.stopPropagation();
            controlPanel.show();
            $(this).hide();
        });
    }

    function togglePanelMinimize() {
        if (!controlPanel) return;
        isPanelMinimized = !isPanelMinimized;
        controlPanel.toggleClass('minimized', isPanelMinimized);
        $('#panel-minimize').text(isPanelMinimized ? '+' : '−');
    }

    function updateControlPanel() {
        if (!controlPanel) return;

        // Update sounds status
        $('#status-sounds').text(SOUNDS_ENABLED ? 'ON' : 'OFF')
            .toggleClass('status-on', SOUNDS_ENABLED)
            .toggleClass('status-off', !SOUNDS_ENABLED);

        // Update notifications status
        $('#status-notify').text(NOTIFICATIONS_ENABLED ? 'ON' : 'OFF')
            .toggleClass('status-on', NOTIFICATIONS_ENABLED)
            .toggleClass('status-off', !NOTIFICATIONS_ENABLED);

        // Update emergency stop status
        $('#status-emergency').text(emergencyStopActive ? 'ON' : 'OFF')
            .toggleClass('status-on', !emergencyStopActive)
            .toggleClass('status-off', emergencyStopActive);

        // Update emergency button text
        $('#btn-emergency').text(emergencyStopActive ? '✅ Enable Alerts' : '🚨 Emergency Stop')
            .toggleClass('enabled', !emergencyStopActive);

        // Update volume display and slider
        const volumePercent = Math.round(MASTER_VOLUME * 100);
        $('#status-volume').text(`${volumePercent}%`);
        $('#volume-slider').css('width', `${Math.min(100, MASTER_VOLUME * 50)}%`);

        // Chat protection is always active
        $('#status-chat-protection').text('ACTIVE').toggleClass('status-on', true);
    }

    function updatePanelStatus() {
        if (!controlPanel) return;

        $('#active-sounds-count').text(activeAudioElements.length);

        $('#test-status').text(isTestRunning ? 'RUNNING' : 'IDLE')
            .css('color', isTestRunning ? '#f39c12' : '#2ecc71');

        const permission = "Notification" in window ? Notification.permission : "unsupported";
        let statusText = '', statusColor = '';

        switch(permission) {
            case 'granted':
                statusText = 'ENABLED';
                statusColor = '#2ecc71';
                break;
            case 'denied':
                statusText = 'BLOCKED';
                statusColor = '#e74c3c';
                break;
            case 'default':
                statusText = 'PENDING';
                statusColor = '#f39c12';
                break;
            default:
                statusText = 'UNSUPPORTED';
                statusColor = '#95a5a6';
        }

        $('#notification-status').text(statusText).css('color', statusColor);
    }

    function addStyles() {
        const css = `
            #soundmaster-panel {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 300px !important;
                background: rgba(30, 30, 40, 0.95) !important;
                border: 2px solid #3498db !important;
                border-radius: 10px !important;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5) !important;
                z-index: 10000 !important;
                font-family: Arial, sans-serif !important;
                color: white !important;
                overflow: hidden !important;
                transition: all 0.3s ease !important;
            }

            #soundmaster-panel.minimized {
                height: 40px !important;
            }

            #soundmaster-panel.minimized .panel-content {
                display: none !important;
            }

            .panel-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 8px 12px !important;
                background: rgba(40, 40, 50, 0.9) !important;
                border-bottom: 1px solid #3498db !important;
                cursor: move !important;
            }

            .panel-title {
                font-weight: bold !important;
                color: #3498db !important;
                font-size: 13px !important;
            }

            .header-buttons {
                display: flex !important;
                gap: 4px !important;
            }

            .header-btn {
                background: transparent !important;
                border: 1px solid #3498db !important;
                color: #3498db !important;
                width: 22px !important;
                height: 22px !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                line-height: 1 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 0 !important;
            }

            .header-btn:hover {
                background: #3498db !important;
                color: white !important;
            }

            .close-btn {
                border-color: #e74c3c !important;
                color: #e74c3c !important;
            }

            .close-btn:hover {
                background: #e74c3c !important;
                color: white !important;
            }

            .panel-content {
                padding: 15px !important;
            }

            .status-display {
                background: rgba(40, 40, 50, 0.7) !important;
                border-radius: 6px !important;
                padding: 10px !important;
                margin-bottom: 15px !important;
            }

            .status-row {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 6px !important;
                font-size: 12px !important;
            }

            .status-row:last-child {
                margin-bottom: 0 !important;
            }

            .status-label {
                color: #bdc3c7 !important;
            }

            .status-value {
                font-weight: bold !important;
                padding: 2px 8px !important;
                border-radius: 4px !important;
                font-size: 11px !important;
            }

            .status-on {
                background: rgba(46, 204, 113, 0.2) !important;
                color: #2ecc71 !important;
                border: 1px solid #2ecc71 !important;
            }

            .status-off {
                background: rgba(231, 76, 60, 0.2) !important;
                color: #e74c3c !important;
                border: 1px solid #e74c3c !important;
            }

            .button-row {
                display: flex !important;
                gap: 10px !important;
                margin-bottom: 10px !important;
            }

            .control-btn, .toggle-btn {
                flex: 1 !important;
                padding: 10px !important;
                border: none !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                font-weight: bold !important;
                font-size: 12px !important;
                color: white !important;
                transition: all 0.2s ease !important;
            }

            .test-btn {
                background: linear-gradient(135deg, #9b59b6, #8e44ad) !important;
            }

            .test-btn:hover {
                background: linear-gradient(135deg, #8e44ad, #7d3c98) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
            }

            .emergency-btn {
                background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
            }

            .emergency-btn.enabled {
                background: linear-gradient(135deg, #2ecc71, #27ae60) !important;
            }

            .emergency-btn:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
            }

            .notification-btn {
                background: linear-gradient(135deg, #3498db, #2980b9) !important;
            }

            .notification-btn:hover {
                background: linear-gradient(135deg, #2980b9, #1f618d) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
            }

            .toggle-btn {
                background: linear-gradient(135deg, #3498db, #2980b9) !important;
            }

            .toggle-btn:hover {
                background: linear-gradient(135deg, #2980b9, #1f618d) !important;
                transform: translateY(-2px) !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
            }

            .volume-controls {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                margin-top: 10px !important;
            }

            .volume-btn {
                background: #7f8c8d !important;
                color: white !important;
                border: none !important;
                width: 40px !important;
                height: 30px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                transition: all 0.2s ease !important;
            }

            .volume-btn:hover {
                background: #95a5a6 !important;
                transform: translateY(-2px) !important;
            }

            .volume-slider-container {
                flex: 1 !important;
            }

            .volume-slider-track {
                height: 6px !important;
                background: rgba(255, 255, 255, 0.1) !important;
                border-radius: 3px !important;
                cursor: pointer !important;
                position: relative !important;
            }

            .volume-slider {
                height: 100% !important;
                background: linear-gradient(90deg, #3498db, #2ecc71) !important;
                border-radius: 3px !important;
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
            }

            .debug-info {
                margin-top: 10px !important;
                text-align: center !important;
                font-size: 10px !important;
                color: #95a5a6 !important;
            }

            #active-sounds-count {
                color: #2ecc71 !important;
                font-weight: bold !important;
            }

            #test-status {
                font-weight: bold !important;
            }

            #soundmaster-reopen {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 40px !important;
                height: 40px !important;
                background: #3498db !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                z-index: 9999 !important;
                font-size: 20px !important;
                display: none !important;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3) !important;
                transition: all 0.3s ease !important;
            }

            #soundmaster-reopen:hover {
                background: #2980b9 !important;
                transform: scale(1.1) !important;
            }

            .soundmaster-on-screen-notification {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                background: rgba(30, 30, 40, 0.95) !important;
                border: 2px solid #3498db !important;
                border-radius: 8px !important;
                padding: 15px !important;
                max-width: 300px !important;
                z-index: 9998 !important;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
                animation: slideIn 0.3s ease !important;
                cursor: pointer !important;
            }

            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            .notification-title {
                font-weight: bold !important;
                color: #3498db !important;
                font-size: 14px !important;
                margin-bottom: 5px !important;
            }

            .notification-body {
                color: #ecf0f1 !important;
                font-size: 12px !important;
                line-height: 1.4 !important;
            }

            .soundmaster-on-screen-notification:hover {
                background: rgba(40, 40, 50, 0.98) !important;
                border-color: #2980b9 !important;
            }
        `;

        GM_addStyle(css);
    }

    // ==================== INITIALIZATION ====================

    $(document).ready(function() {
        console.log('🎵 SoundMaster Pro v3.9.9 - SIMPLE CHAT FIX!');

        addStyles();
        createControlPanel();
        autoEnableNotifications();
        setupChatClickHandler();
        setupMutationObservers();

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'Escape':
                        toggleEmergencyStop();
                        e.preventDefault();
                        break;
                    case 'P':
                        if (controlPanel.is(':visible')) {
                            controlPanel.hide();
                            $('#soundmaster-reopen').show();
                        } else {
                            controlPanel.show();
                            $('#soundmaster-reopen').hide();
                        }
                        e.preventDefault();
                        break;
                    case 'T':
                        manualTestButtonClick();
                        e.preventDefault();
                        break;
                    case 'M':
                        togglePanelMinimize();
                        e.preventDefault();
                        break;
                    case 'S':
                        toggleSounds();
                        e.preventDefault();
                        break;
                    case 'N':
                        toggleNotifications();
                        e.preventDefault();
                        break;
                    case 'ArrowDown':
                        adjustVolume(-0.1);
                        e.preventDefault();
                        break;
                    case 'ArrowUp':
                        adjustVolume(0.1);
                        e.preventDefault();
                        break;
                }
            }
        });

        setTimeout(() => {
            showNotification(
                '🎵 SoundMaster Pro Ready!',
                'SIMPLE FIX: Emergency stop triggers on chat clicks!\n' +
                'Keyboard Shortcuts:\n' +
                '• Ctrl+S: Toggle Sounds\n' +
                '• Ctrl+N: Toggle Notifications\n' +
                '• Ctrl+↑/↓: Volume Control\n' +
                '• Ctrl+T: Quick Test\n' +
                '• Ctrl+Escape: Emergency Stop'
            );
        }, 2000);
    });

})();