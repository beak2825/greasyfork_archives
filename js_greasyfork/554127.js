// ==UserScript==
// @name         Torn Chain Alert
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  In-game alerts to save your faction chain
// @author       TornChainBot
// @match        https://www.torn.com/*
// @license      MIT
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/554127/Torn%20Chain%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/554127/Torn%20Chain%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_KEY: GM_getValue('torn_api_key', ''), // API Key to configure
        FACTION_ID: GM_getValue('faction_id', ''), // Faction ID to configure
        CHECK_INTERVAL: 5000, // 5 seconds like Discord bot
        ALERT_THRESHOLDS: [89, 60, 30], // Alert thresholds in seconds
        NOTIFICATION_SOUND: true,
        VISUAL_ALERT: true
    };

    let lastChainData = null;
    let lastNotificationTime = 0;
    let alertActive = false;

    // Create configuration interface
    function createConfigPanel() {
        const panel = $(`
            <div id="chain-config-panel" style="
                position: fixed;
                top: 80px;
                right: 20px;
                width: 140px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 2px solid #444;
                border-radius: 15px;
                padding: 10px;
                z-index: 10000;
                color: white;
                font-family: Arial, sans-serif;
                display: none;
                font-size: 10px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                backdrop-filter: blur(10px);
            ">
                <div style="
                    margin-bottom: 6px;
                    font-weight: bold;
                    text-align: center;
                    color: #4CAF50;
                    font-size: 11px;
                ">⚙️ Config</div>
                <input type="text" id="api-key-input" value="${CONFIG.API_KEY}" placeholder="API Key" style="
                    width: 100%;
                    padding: 4px 6px;
                    margin-bottom: 4px;
                    font-size: 9px;
                    border-radius: 6px;
                    border: 1px solid #555;
                    background: #2a2a2a;
                    color: white;
                    box-sizing: border-box;
                ">
                <input type="text" id="faction-id-input" value="${CONFIG.FACTION_ID}" placeholder="Faction ID" style="
                    width: 100%;
                    padding: 4px 6px;
                    margin-bottom: 6px;
                    font-size: 9px;
                    border-radius: 6px;
                    border: 1px solid #555;
                    background: #2a2a2a;
                    color: white;
                    box-sizing: border-box;
                ">
                <div style="
                    display: flex;
                    gap: 8px;
                    margin-bottom: 6px;
                    justify-content: center;
                ">
                    <label style="font-size: 9px; cursor: pointer;">
                        <input type="checkbox" id="sound-checkbox" ${CONFIG.NOTIFICATION_SOUND ? 'checked' : ''} style="margin-right: 2px;">
                        Sound
                    </label>
                    <label style="font-size: 9px; cursor: pointer;">
                        <input type="checkbox" id="visual-checkbox" ${CONFIG.VISUAL_ALERT ? 'checked' : ''} style="margin-right: 2px;">
                        Alert
                    </label>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button id="save-config" style="
                        background: #43a047;
                        color: white;
                        padding: 4px 6px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 9px;
                        flex: 1;
                    ">💾</button>
                    <button id="close-config" style="
                        background: #f44336;
                        color: white;
                        padding: 4px 6px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 9px;
                        flex: 1;
                    ">✕</button>
                </div>
            </div>
        `);

        $('body').append(panel);

        // Event handlers
        $('#save-config').click(function() {
            CONFIG.API_KEY = $('#api-key-input').val();
            CONFIG.FACTION_ID = $('#faction-id-input').val();
            CONFIG.NOTIFICATION_SOUND = $('#sound-checkbox').is(':checked');
            CONFIG.VISUAL_ALERT = $('#visual-checkbox').is(':checked');

            // Save settings
            GM_setValue('torn_api_key', CONFIG.API_KEY);
            GM_setValue('faction_id', CONFIG.FACTION_ID);
            GM_setValue('notification_sound', CONFIG.NOTIFICATION_SOUND);
            GM_setValue('visual_alert', CONFIG.VISUAL_ALERT);

            alert('Config saved!');
            $('#chain-config-panel').hide();
        });

        $('#close-config').click(function() {
            $('#chain-config-panel').hide();
        });
    }

    // Create status button and configuration
    function createStatusButton() {
        const button = $(`
            <div id="chain-status-button" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 2px solid #444;
                border-radius: 15px;
                padding: 10px 15px;
                z-index: 9999;
                color: white;
                font-family: 'Segoe UI', Arial, sans-serif;
                cursor: pointer;
                user-select: none;
                font-size: 12px;
                min-width: 140px;
                text-align: center;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                backdrop-filter: blur(5px);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.3)'">
                <div id="chain-status-text">🔗 Chain: --</div>
                <div style="font-size: 10px; opacity: 0.6;">Click to config</div>
            </div>
        `);

        $('body').append(button);

        button.click(function() {
            $('#chain-config-panel').toggle();
        });
    }

    // Create visual alert positioned under chain
    function createVisualAlert(message, timeLeft) {
        if (!CONFIG.VISUAL_ALERT) return;

        // Remove old alert if exists
        $('#chain-visual-alert').remove();

        const alertColor = timeLeft <= 30 ? '#ff4444' : timeLeft <= 60 ? '#ff8800' : timeLeft <= 89 ? '#ffaa00' : '#ffcc00';

        // Generate random targets like Discord bot
        const minID = 3000000;
        const maxID = 3400000;
        const targets = [
            Math.floor(Math.random() * (maxID - minID + 1)) + minID,
            Math.floor(Math.random() * (maxID - minID + 1)) + minID,
            Math.floor(Math.random() * (maxID - minID + 1)) + minID
        ];

        const alert = $(`
            <div id="chain-visual-alert" style="
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 2px solid ${alertColor};
                border-radius: 15px;
                padding: 12px;
                z-index: 10001;
                color: white;
                font-family: 'Segoe UI', Arial, sans-serif;
                cursor: pointer;
                user-select: none;
                font-size: 12px;
                min-width: 140px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${alertColor}40;
                backdrop-filter: blur(10px);
                animation: chainPulse 2s ease-in-out infinite alternate;
                transition: all 0.3s ease;
            ">
                <div style="
                    font-size: 13px;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: ${alertColor};
                    text-shadow: 0 0 10px ${alertColor}80;
                ">⚠️ ${formatTime(timeLeft)}</div>
                <div style="font-size: 9px; margin-bottom: 6px; opacity: 0.8;">Quick Targets:</div>
                <button class="target-btn" data-id="${targets[0]}" style="
                    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
                    color: white;
                    padding: 4px 8px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 9px;
                    width: 100%;
                    margin-bottom: 3px;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(67,160,71,0.3);
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Target 1</button>
                <button class="target-btn" data-id="${targets[1]}" style="
                    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
                    color: white;
                    padding: 4px 8px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 9px;
                    width: 100%;
                    margin-bottom: 3px;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(67,160,71,0.3);
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Target 2</button>
                <button class="target-btn" data-id="${targets[2]}" style="
                    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
                    color: white;
                    padding: 4px 8px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 9px;
                    width: 100%;
                    margin-bottom: 6px;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(67,160,71,0.3);
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Target 3</button>
                <div style="
                    font-size: 8px;
                    opacity: 0.6;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 4px;
                ">Click target to attack</div>
            </div>
        `);

        // Add CSS animation
        if (!$('#chain-animation-style').length) {
            $('head').append(`
                <style id="chain-animation-style">
                    @keyframes chainPulse {
                        0% {
                            transform: scale(1);
                            box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${alertColor}40;
                        }
                        100% {
                            transform: scale(1.02);
                            box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${alertColor}60;
                        }
                    }
                </style>
            `);
        }

        $('body').append(alert);

        // Button handlers
        $('.target-btn').click(function() {
            const targetId = $(this).data('id');
            window.open(`https://www.torn.com/loader.php?sid=attack&user2ID=${targetId}`, '_blank');
            $('#chain-visual-alert').remove();
        });

        // Click anywhere on alert to dismiss
        $('#chain-visual-alert').click(function(e) {
            if (!$(e.target).hasClass('target-btn')) {
                $('#chain-visual-alert').remove();
            }
        });

        // Auto-close after 15 seconds
        setTimeout(function() {
            $('#chain-visual-alert').fadeOut(500, function() {
                $(this).remove();
            });
        }, 15000);
    }

    // Play alert sound
    function playAlertSound() {
        if (!CONFIG.NOTIFICATION_SOUND) return;

        // Create simple alert sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    }

    // Format time
    function formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds === 0 ? `${minutes}min` : `${minutes}min ${remainingSeconds}s`;
    }

    // Get chain data
    async function getChainData() {
        if (!CONFIG.API_KEY || !CONFIG.FACTION_ID) {
            console.log('Chain Alert: Missing configuration');
            return null;
        }

        try {
            const timestamp = Date.now();
            const response = await fetch(`https://api.torn.com/v2/faction/${CONFIG.FACTION_ID}/chain?key=${CONFIG.API_KEY}&timestamp=${timestamp}&comment=ChainAlert-UserScript`);
            const data = await response.json();

            if (data.error) {
                console.error('Chain Alert API Error:', data.error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Chain Alert: Data fetch error:', error);
            return null;
        }
    }

    // Update status
    function updateStatus(chainData) {
        const statusText = $('#chain-status-text');
        const statusButton = $('#chain-status-button');

        if (!chainData || !chainData.chain || chainData.chain.current === 0) {
            statusText.text('🔗 Chain: None');
            statusButton.css('border-color', '#666');
            return;
        }

        const chain = chainData.chain;
        const timeLeft = Math.max(0, chain.timeout);

        statusText.text(`🔗 Chain: ${chain.current} (${formatTime(timeLeft)})`);

        // Change color based on time left
        if (timeLeft <= 30) {
            statusButton.css('border-color', '#ff4444');
        } else if (timeLeft <= 60) {
            statusButton.css('border-color', '#ff8800');
        } else if (timeLeft <= 89) {
            statusButton.css('border-color', '#ffaa00');
        } else {
            statusButton.css('border-color', '#44ff44');
        }
    }

    // Check alerts
    function checkAlerts(chainData) {
        if (!chainData || !chainData.chain || chainData.chain.current === 0) {
            alertActive = false;
            return;
        }

        const chain = chainData.chain;
        const timeLeft = Math.max(0, chain.timeout);

        // Check if we should trigger an alert
        for (const threshold of CONFIG.ALERT_THRESHOLDS) {
            if (timeLeft <= threshold && timeLeft > 0) {
                // Check if we just crossed this threshold
                const justCrossedThreshold = !lastChainData || lastChainData.timeout > threshold;
                const enoughTimePassed = Date.now() - lastNotificationTime >= 30000; // 30s minimum between alerts

                if (justCrossedThreshold && enoughTimePassed) {
                    console.log(`Chain Alert: ${threshold}s threshold crossed (${timeLeft}s remaining)`);

                    const message = `Chain of ${chain.current.toLocaleString()} hits will break in ${formatTime(timeLeft)}!`;

                    // Browser notification
                    if (GM_notification) {
                        GM_notification(message, '⚠️ Torn Chain Alert', 'https://www.torn.com/favicon.ico');
                    }

                    // Visual alert
                    createVisualAlert(message, timeLeft);

                    // Alert sound
                    playAlertSound();

                    lastNotificationTime = Date.now();
                    alertActive = true;
                    break;
                }
            }
        }

        // Reset alert if chain is saved
        if (timeLeft > 250 && alertActive) {
            alertActive = false;
            console.log('Chain Alert: Chain saved!');
        }
    }

    // Main check function
    async function checkChain() {
        const chainData = await getChainData();

        updateStatus(chainData);
        checkAlerts(chainData);

        if (chainData && chainData.chain) {
            lastChainData = chainData.chain;
        }
    }

    // Initialization
    function init() {
        console.log('Chain Alert: Script initialized');

        // Load saved configuration
        CONFIG.NOTIFICATION_SOUND = GM_getValue('notification_sound', true);
        CONFIG.VISUAL_ALERT = GM_getValue('visual_alert', true);

        // Create interface
        createStatusButton();
        createConfigPanel();

        // Start monitoring
        checkChain(); // Immediate check
        setInterval(checkChain, CONFIG.CHECK_INTERVAL);

        console.log('Chain Alert: Monitoring started');
    }

    // Wait for page to load
    $(document).ready(function() {
        // Delay to ensure Torn is fully loaded
        setTimeout(init, 2000);
    });

})();