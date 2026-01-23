// ==UserScript==
// @name         LincolnLawyer's IQRPG SoundMaster Pro
// @namespace    https://www.iqrpg.com/lincolnlawyer/
// @version      4.1.1
// @description  ENHANCED: Better sounds with minimize feature
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
// @supportURL   https://greasyfork.org/en/scripts/554816/lincolnlawyer-s-iqrpg-soundmaster-pro/code
// @downloadURL https://update.greasyfork.org/scripts/554816/LincolnLawyer%27s%20IQRPG%20SoundMaster%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/554816/LincolnLawyer%27s%20IQRPG%20SoundMaster%20Pro.meta.js
// ==/UserScript==

/* ════════════════════════════════════════════════════════════════════════
   Copyright Notice & License

   LincolnLawyer's IQRPG SoundMaster Pro v4.1.1
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

    console.log("🎵 SoundMaster Pro v4.1.1 - WITH MINIMIZE FEATURE");

    let SOUNDS_ENABLED = true;
    let NOTIFICATIONS_ENABLED = true;
    let MASTER_VOLUME = 1.0;
    let audioContext = null;
    let audioEnabled = false;
    let isPanelMinimized = false;

    const SIMPLE_RAID_PATTERNS = ['raid', 'current raid', 'standard raid', 'scouted raid'];

    // ENHANCED SOUND SYSTEM - PROFESSIONAL GAME SOUNDS
    function playEnhancedSound(soundType) {
        if (!SOUNDS_ENABLED || !audioEnabled) return;

        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            const now = audioContext.currentTime;
            const gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.value = MASTER_VOLUME;

            console.log(`🔊 Playing ${soundType} sound`);

            switch(soundType) {
                case 'land':
                    // EPIC VICTORY FANFARE - multiple oscillators for rich sound
                    const osc1 = audioContext.createOscillator();
                    const osc2 = audioContext.createOscillator();
                    const osc3 = audioContext.createOscillator();
                    
                    osc1.type = 'sawtooth';
                    osc2.type = 'triangle';
                    osc3.type = 'sine';
                    
                    osc1.frequency.setValueAtTime(392, now); // G4
                    osc1.frequency.exponentialRampToValueAtTime(784, now + 0.5); // G5
                    
                    osc2.frequency.setValueAtTime(523, now); // C5
                    osc2.frequency.exponentialRampToValueAtTime(1046, now + 0.5); // C6
                    
                    osc3.frequency.setValueAtTime(659, now); // E5
                    osc3.frequency.exponentialRampToValueAtTime(1318, now + 0.5); // E6
                    
                    const gain1 = audioContext.createGain();
                    const gain2 = audioContext.createGain();
                    const gain3 = audioContext.createGain();
                    
                    gain1.gain.setValueAtTime(0.1 * MASTER_VOLUME, now);
                    gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
                    
                    gain2.gain.setValueAtTime(0.08 * MASTER_VOLUME, now);
                    gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
                    
                    gain3.gain.setValueAtTime(0.06 * MASTER_VOLUME, now);
                    gain3.gain.exponentialRampToValueAtTime(0.01, now + 1);
                    
                    osc1.connect(gain1).connect(gainNode);
                    osc2.connect(gain2).connect(gainNode);
                    osc3.connect(gain3).connect(gainNode);
                    
                    osc1.start(now);
                    osc2.start(now + 0.1);
                    osc3.start(now + 0.2);
                    
                    osc1.stop(now + 1.5);
                    osc2.stop(now + 1.4);
                    osc3.stop(now + 1.3);
                    break;

                case 'test':
                    // PLEASANT CHIME SOUND - like a notification
                    const testOsc1 = audioContext.createOscillator();
                    const testOsc2 = audioContext.createOscillator();
                    
                    testOsc1.type = 'sine';
                    testOsc2.type = 'sine';
                    
                    testOsc1.frequency.setValueAtTime(880, now); // A5
                    testOsc1.frequency.exponentialRampToValueAtTime(440, now + 0.3); // A4
                    
                    testOsc2.frequency.setValueAtTime(1318, now); // E6
                    testOsc2.frequency.exponentialRampToValueAtTime(659, now + 0.3); // E5
                    
                    const testGain = audioContext.createGain();
                    testGain.gain.setValueAtTime(0.15 * MASTER_VOLUME, now);
                    testGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    
                    testOsc1.connect(testGain).connect(gainNode);
                    testOsc2.connect(testGain).connect(gainNode);
                    
                    testOsc1.start(now);
                    testOsc2.start(now);
                    testOsc1.stop(now + 0.5);
                    testOsc2.stop(now + 0.5);
                    break;

                case 'auto':
                    // ROBOTIC DOUBLE BEEP - for automation alerts
                    const autoOsc = audioContext.createOscillator();
                    autoOsc.type = 'square';
                    
                    const autoGain = audioContext.createGain();
                    autoGain.connect(gainNode);
                    
                    // First beep
                    autoOsc.frequency.setValueAtTime(800, now);
                    autoGain.gain.setValueAtTime(0.2 * MASTER_VOLUME, now);
                    autoGain.gain.setValueAtTime(0, now + 0.1);
                    
                    // Second beep
                    autoOsc.frequency.setValueAtTime(1200, now + 0.15);
                    autoGain.gain.setValueAtTime(0.2 * MASTER_VOLUME, now + 0.15);
                    autoGain.gain.setValueAtTime(0, now + 0.25);
                    
                    autoOsc.connect(autoGain);
                    autoOsc.start(now);
                    autoOsc.stop(now + 0.3);
                    break;

                case 'alert':
                    // URGENT ALERT SOUND - for important notifications
                    const alertOsc1 = audioContext.createOscillator();
                    const alertOsc2 = audioContext.createOscillator();
                    
                    alertOsc1.type = 'sawtooth';
                    alertOsc2.type = 'sawtooth';
                    
                    alertOsc1.frequency.setValueAtTime(200, now);
                    alertOsc1.frequency.setValueAtTime(400, now + 0.1);
                    alertOsc1.frequency.setValueAtTime(200, now + 0.2);
                    
                    alertOsc2.frequency.setValueAtTime(300, now);
                    alertOsc2.frequency.setValueAtTime(600, now + 0.1);
                    alertOsc2.frequency.setValueAtTime(300, now + 0.2);
                    
                    const alertGain = audioContext.createGain();
                    alertGain.gain.setValueAtTime(0.25 * MASTER_VOLUME, now);
                    alertGain.gain.setValueAtTime(0.25 * MASTER_VOLUME, now + 0.1);
                    alertGain.gain.setValueAtTime(0.25 * MASTER_VOLUME, now + 0.2);
                    alertGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    
                    alertOsc1.connect(alertGain).connect(gainNode);
                    alertOsc2.connect(alertGain).connect(gainNode);
                    
                    alertOsc1.start(now);
                    alertOsc2.start(now);
                    alertOsc1.stop(now + 0.5);
                    alertOsc2.stop(now + 0.5);
                    break;

                case 'success':
                    // SUCCESS CHIME - positive feedback
                    const successOsc1 = audioContext.createOscillator();
                    const successOsc2 = audioContext.createOscillator();
                    const successOsc3 = audioContext.createOscillator();
                    
                    successOsc1.type = 'sine';
                    successOsc2.type = 'sine';
                    successOsc3.type = 'sine';
                    
                    // C major chord arpeggio
                    successOsc1.frequency.setValueAtTime(523, now); // C5
                    successOsc2.frequency.setValueAtTime(659, now + 0.1); // E5
                    successOsc3.frequency.setValueAtTime(784, now + 0.2); // G5
                    
                    const successGain = audioContext.createGain();
                    successGain.gain.setValueAtTime(0.15 * MASTER_VOLUME, now);
                    successGain.gain.setValueAtTime(0.15 * MASTER_VOLUME, now + 0.1);
                    successGain.gain.setValueAtTime(0.15 * MASTER_VOLUME, now + 0.2);
                    successGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                    
                    successOsc1.connect(successGain).connect(gainNode);
                    successOsc2.connect(successGain).connect(gainNode);
                    successOsc3.connect(successGain).connect(gainNode);
                    
                    successOsc1.start(now);
                    successOsc2.start(now + 0.1);
                    successOsc3.start(now + 0.2);
                    
                    successOsc1.stop(now + 0.8);
                    successOsc2.stop(now + 0.8);
                    successOsc3.stop(now + 0.8);
                    break;

                default:
                    // DEFAULT NOTIFICATION
                    const defaultOsc = audioContext.createOscillator();
                    defaultOsc.type = 'sine';
                    defaultOsc.frequency.setValueAtTime(1000, now);
                    
                    const defaultGain = audioContext.createGain();
                    defaultGain.gain.setValueAtTime(0.2 * MASTER_VOLUME, now);
                    defaultGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    
                    defaultOsc.connect(defaultGain).connect(gainNode);
                    defaultOsc.start(now);
                    defaultOsc.stop(now + 0.3);
            }
        } catch (error) {
            console.error('❌ Audio error:', error);
            // Fallback to simple beep
            createSimpleBeep(soundType);
        }
    }

    // Fallback simple beep function
    function createSimpleBeep(soundType) {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        let frequency = 800;
        let duration = 0.3;

        switch(soundType) {
            case 'land':
                frequency = 1000;
                duration = 0.5;
                break;
            case 'test':
                frequency = 800;
                duration = 0.3;
                break;
            case 'alert':
                frequency = 600;
                duration = 0.4;
                break;
        }

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        gainNode.gain.value = MASTER_VOLUME * 0.2;

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, duration * 1000);
    }

    function enableAudio() {
        audioEnabled = true;
        console.log('✅ Audio enabled by user interaction');
        playEnhancedSound('success');
        showNotification('🔊 Audio Enabled', 'Enhanced sounds are now active!');
        updateControlPanel();
    }

    function toggleMinimizePanel() {
        isPanelMinimized = !isPanelMinimized;
        const panel = $('#soundmaster-panel');
        const content = $('.panel-content');
        const minimizeBtn = $('#panel-minimize');
        
        if (isPanelMinimized) {
            content.slideUp(300);
            minimizeBtn.html('⏷');
            minimizeBtn.attr('title', 'Maximize Panel');
            panel.css('width', '200px');
            console.log('📦 Panel minimized');
        } else {
            content.slideDown(300);
            minimizeBtn.html('⏶');
            minimizeBtn.attr('title', 'Minimize Panel');
            panel.css('width', '350px');
            console.log('📦 Panel maximized');
        }
        
        // Play a subtle sound
        if (audioEnabled) {
            playEnhancedSound('test');
        }
    }

    function createControlPanel() {
        $('#soundmaster-panel').remove();
        $('#soundmaster-reopen').remove();

        const controlPanel = $(`
            <div id="soundmaster-panel" class="soundmaster-panel">
                <div class="panel-header">
                    <span class="panel-title">🎵 SoundMaster v4.1.1</span>
                    <div class="header-buttons">
                        <button id="panel-minimize" class="header-btn minimize-btn" title="Minimize Panel">⏶</button>
                        <button id="panel-close" class="header-btn close-btn" title="Close Panel">×</button>
                    </div>
                </div>
                <div class="panel-content">
                    <div class="status-display">
                        <div class="status-row">
                            <span class="status-label">Audio Status:</span>
                            <span id="status-audio" class="status-value ${audioEnabled ? 'status-on' : 'status-off'}">${audioEnabled ? 'ENABLED' : 'CLICK BELOW'}</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">Sound Quality:</span>
                            <span id="status-quality" class="status-value status-premium">ENHANCED</span>
                        </div>
                        <div class="status-row">
                            <span class="status-label">Raid Detection:</span>
                            <span id="status-raid" class="status-value status-on">ACTIVE</span>
                        </div>
                    </div>

                    <div class="button-row">
                        <button id="btn-enable-audio" class="control-btn enable-btn">🔊 CLICK TO ENABLE SOUNDS</button>
                    </div>

                    <div class="sound-test-section">
                        <div class="section-title">Test Enhanced Sounds:</div>
                        <div class="button-row">
                            <button id="btn-test" class="control-btn test-btn">🎵 TEST CHIME</button>
                            <button id="btn-test-land" class="control-btn land-btn">🏆 EPIC VICTORY</button>
                        </div>
                        <div class="button-row">
                            <button id="btn-test-alert" class="control-btn alert-btn">🚨 TEST ALERT</button>
                            <button id="btn-test-success" class="control-btn success-btn">✅ SUCCESS SOUND</button>
                        </div>
                    </div>

                    <div class="volume-controls">
                        <button id="btn-volume-down" class="volume-btn">-</button>
                        <span>Volume: <span id="volume-level">100%</span></span>
                        <button id="btn-volume-up" class="volume-btn">+</button>
                    </div>

                    <div class="debug-info">
                        <small>Click ⏶ to minimize • Watching for raids</small>
                    </div>
                </div>
            </div>
        `).appendTo('body');

        setupControlPanelEvents();
        updateControlPanel();
    }

    function setupControlPanelEvents() {
        $('#panel-minimize').click(function() {
            toggleMinimizePanel();
        });

        $('#panel-close').click(function() {
            $('#soundmaster-panel').hide();
            // Show reopen button
            createReopenButton();
        });

        $('#btn-enable-audio').click(function() {
            enableAudio();
        });

        $('#btn-test').click(function() {
            if (audioEnabled) {
                playEnhancedSound('test');
            } else {
                alert('⚠️ Please click "CLICK TO ENABLE SOUNDS" first!');
            }
        });

        $('#btn-test-land').click(function() {
            if (audioEnabled) {
                playEnhancedSound('land');
            } else {
                alert('⚠️ Please click "CLICK TO ENABLE SOUNDS" first!');
            }
        });

        $('#btn-test-alert').click(function() {
            if (audioEnabled) {
                playEnhancedSound('alert');
            } else {
                alert('⚠️ Please click "CLICK TO ENABLE SOUNDS" first!');
            }
        });

        $('#btn-test-success').click(function() {
            if (audioEnabled) {
                playEnhancedSound('success');
            } else {
                alert('⚠️ Please click "CLICK TO ENABLE SOUNDS" first!');
            }
        });

        $('#btn-volume-down').click(function() {
            MASTER_VOLUME = Math.max(0, MASTER_VOLUME - 0.1);
            updateControlPanel();
        });

        $('#btn-volume-up').click(function() {
            MASTER_VOLUME = Math.min(2, MASTER_VOLUME + 0.1);
            updateControlPanel();
        });
    }

    function createReopenButton() {
        $('#soundmaster-reopen').remove();
        
        const reopenBtn = $(`
            <button id="soundmaster-reopen" class="reopen-btn" title="Reopen Sound Panel">
                🎵
            </button>
        `).appendTo('body');
        
        reopenBtn.click(function() {
            createControlPanel();
            $(this).remove();
        });
    }

    function updateControlPanel() {
        $('#status-audio').text(audioEnabled ? 'ENABLED' : 'CLICK BELOW')
            .toggleClass('status-on', audioEnabled)
            .toggleClass('status-off', !audioEnabled);

        $('#volume-level').text(Math.round(MASTER_VOLUME * 100) + '%');

        $('#btn-enable-audio').text(audioEnabled ? '✅ SOUNDS ENABLED' : '🔊 CLICK TO ENABLE SOUNDS');
    }

    function showNotification(title, body) {
        console.log(`📢 ${title}: ${body}`);

        if (Notification.permission === "granted") {
            new Notification(title, { body: body, icon: 'https://www.iqrpg.com/favicon.ico' });
        }
    }

    function addStyles() {
        const css = `
            #soundmaster-panel {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 350px !important;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
                border: 2px solid #00adb5 !important;
                border-radius: 12px !important;
                z-index: 10000 !important;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
                color: #eeeeee !important;
                box-shadow: 0 8px 32px rgba(0, 173, 181, 0.3) !important;
                backdrop-filter: blur(10px) !important;
                transition: width 0.3s ease !important;
                overflow: hidden !important;
            }
            .panel-header {
                padding: 12px 15px !important;
                background: rgba(0, 0, 0, 0.3) !important;
                border-bottom: 1px solid rgba(0, 173, 181, 0.5) !important;
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                border-radius: 10px 10px 0 0 !important;
                cursor: move !important;
            }
            .panel-title {
                font-weight: bold !important;
                color: #00adb5 !important;
                font-size: 15px !important;
                text-shadow: 0 0 10px rgba(0, 173, 181, 0.5) !important;
                user-select: none !important;
            }
            .header-buttons {
                display: flex !important;
                gap: 8px !important;
            }
            .header-btn {
                background: #393e46 !important;
                border: none !important;
                color: white !important;
                width: 26px !important;
                height: 26px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                font-size: 16px !important;
                transition: all 0.3s !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .minimize-btn {
                background: #393e46 !important;
            }
            .minimize-btn:hover {
                background: #00adb5 !important;
                transform: scale(1.1) !important;
            }
            .close-btn {
                background: #ff2e63 !important;
            }
            .close-btn:hover {
                background: #ff5c8d !important;
                transform: rotate(90deg) !important;
            }
            .panel-content {
                padding: 18px !important;
                transition: all 0.3s ease !important;
            }
            .status-display {
                background: rgba(0, 0, 0, 0.4) !important;
                border-radius: 8px !important;
                padding: 12px !important;
                margin-bottom: 18px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            .status-row {
                display: flex !important;
                justify-content: space-between !important;
                margin-bottom: 10px !important;
                font-size: 13px !important;
                align-items: center !important;
            }
            .status-value {
                font-weight: bold !important;
                padding: 4px 12px !important;
                border-radius: 20px !important;
                font-size: 12px !important;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
            }
            .status-on {
                background: linear-gradient(135deg, #00b09b, #96c93d) !important;
                color: white !important;
                box-shadow: 0 0 10px rgba(0, 176, 155, 0.5) !important;
            }
            .status-off {
                background: linear-gradient(135deg, #ff416c, #ff4b2b) !important;
                color: white !important;
                box-shadow: 0 0 10px rgba(255, 65, 108, 0.5) !important;
            }
            .status-premium {
                background: linear-gradient(135deg, #9d50bb, #6e48aa) !important;
                color: white !important;
                box-shadow: 0 0 10px rgba(157, 80, 187, 0.5) !important;
            }
            .button-row {
                display: flex !important;
                gap: 10px !important;
                margin-bottom: 12px !important;
            }
            .control-btn {
                flex: 1 !important;
                padding: 14px 12px !important;
                border: none !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                font-weight: bold !important;
                font-size: 13px !important;
                color: white !important;
                transition: all 0.3s ease !important;
                text-align: center !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;
            }
            .enable-btn {
                background: linear-gradient(135deg, #00adb5, #0097a7) !important;
                box-shadow: 0 4px 15px rgba(0, 173, 181, 0.4) !important;
            }
            .enable-btn:hover {
                transform: translateY(-3px) !important;
                box-shadow: 0 6px 20px rgba(0, 173, 181, 0.6) !important;
            }
            .test-btn {
                background: linear-gradient(135deg, #3498db, #2980b9) !important;
                box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4) !important;
            }
            .land-btn {
                background: linear-gradient(135deg, #ff9800, #f57c00) !important;
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.4) !important;
            }
            .alert-btn {
                background: linear-gradient(135deg, #ff416c, #ff4b2b) !important;
                box-shadow: 0 4px 15px rgba(255, 65, 108, 0.4) !important;
            }
            .success-btn {
                background: linear-gradient(135deg, #00b09b, #96c93d) !important;
                box-shadow: 0 4px 15px rgba(0, 176, 155, 0.4) !important;
            }
            .test-btn:hover, .land-btn:hover, .alert-btn:hover, .success-btn:hover {
                transform: translateY(-2px) !important;
                filter: brightness(1.1) !important;
            }
            .sound-test-section {
                margin: 18px 0 !important;
                padding: 15px !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border-radius: 8px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            .section-title {
                font-size: 14px !important;
                font-weight: bold !important;
                color: #00adb5 !important;
                margin-bottom: 12px !important;
                text-align: center !important;
            }
            .volume-controls {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 20px !important;
                margin: 20px 0 !important;
                padding: 15px !important;
                background: rgba(0, 0, 0, 0.3) !important;
                border-radius: 8px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            .volume-btn {
                background: #393e46 !important;
                color: #00adb5 !important;
                border: 2px solid #00adb5 !important;
                width: 36px !important;
                height: 36px !important;
                border-radius: 50% !important;
                cursor: pointer !important;
                font-size: 20px !important;
                font-weight: bold !important;
                transition: all 0.3s !important;
            }
            .volume-btn:hover {
                background: #00adb5 !important;
                color: white !important;
                transform: scale(1.1) !important;
            }
            #volume-level {
                color: #00adb5 !important;
                font-weight: bold !important;
                font-size: 16px !important;
                min-width: 50px !important;
                display: inline-block !important;
                text-align: center !important;
            }
            .debug-info {
                text-align: center !important;
                font-size: 11px !important;
                color: #888 !important;
                margin-top: 15px !important;
                padding-top: 12px !important;
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
            }
            
            /* Reopen Button Styles */
            #soundmaster-reopen {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, #00adb5, #0097a7) !important;
                border: 2px solid #00adb5 !important;
                color: white !important;
                font-size: 24px !important;
                cursor: pointer !important;
                z-index: 9999 !important;
                box-shadow: 0 4px 15px rgba(0, 173, 181, 0.4) !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            #soundmaster-reopen:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 6px 20px rgba(0, 173, 181, 0.6) !important;
            }
            
            /* Minimized panel width */
            #soundmaster-panel.minimized {
                width: 200px !important;
            }
            
            /* Panel content when minimized */
            #soundmaster-panel.minimized .panel-content {
                display: none !important;
            }
        `;
        GM_addStyle(css);
    }

    function detectLandRaid(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        for (const pattern of SIMPLE_RAID_PATTERNS) {
            if (lowerText.includes(pattern)) {
                console.log('🎯 Found raid:', pattern);
                return true;
            }
        }
        return false;
    }

    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.textContent) {
                            if (detectLandRaid(node.textContent)) {
                                console.log('🏆 Raid detected!');
                                if (audioEnabled) playEnhancedSound('land');
                                showNotification('🏆 RAID DETECTED!', 'Found: ' + node.textContent.substring(0, 50));
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('👀 Enhanced observer active');
    }

    $(document).ready(function() {
        console.log('✅ SoundMaster Pro v4.1.1 with Minimize Feature loaded');

        addStyles();
        createControlPanel();
        setupObserver();

        // Request notification permission
        if (Notification.permission === "default") {
            setTimeout(() => {
                Notification.requestPermission();
            }, 2000);
        }

        console.log('📍 Panel in bottom-right corner');
        console.log('📦 Click ⏶ to minimize/maximize the panel');
        console.log('🔊 Click "CLICK TO ENABLE SOUNDS" to activate enhanced audio');
    });

})();