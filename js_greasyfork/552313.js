// ==UserScript==
// @name         Chat World Control Panel
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Control panel for Chat World with themes, auto-messaging, name management, and random name colors
// @author       boxman123
// @match        https://chatworldofficial.com/chat.html*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT  I dont care use it or skid it
// @downloadURL https://update.greasyfork.org/scripts/552313/Chat%20World%20Control%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/552313/Chat%20World%20Control%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Add custom styles for the control panel
    GM_addStyle(`
        #tmControlPanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: #ffffff;
            border: 3px solid #3399ff;
            border-radius: 15px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow-y: auto;
            display: none;
        }
        
        #tmControlPanel.active {
            display: block;
        }
        
        #tmTogglePanel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3399ff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            z-index: 10001;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(51, 153, 255, 0.5);
            transition: all 0.3s ease;
        }
        
        #tmTogglePanel:hover {
            background: #2980b9;
            transform: scale(1.1);
        }
        
        .tm-section {
            margin: 15px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3399ff;
        }
        
        .tm-section h3 {
            margin: 0 0 12px 0;
            color: #3399ff;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .tm-input {
            width: 100%;
            padding: 10px;
            margin: 6px 0;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-sizing: border-box;
            font-size: 14px;
        }
        
        .tm-button {
            background: #3399ff;
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 3px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s ease;
        }
        
        .tm-button:hover {
            background: #2980b9;
            transform: translateY(-2px);
        }
        
        .tm-button.danger {
            background: #e74c3c;
        }
        
        .tm-button.danger:hover {
            background: #c0392b;
        }
        
        .tm-button.success {
            background: #27ae60;
        }
        
        .tm-button.success:hover {
            background: #219a52;
        }
        
        #tmSpamStatus {
            font-size: 12px;
            margin-top: 8px;
            padding: 5px;
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
        }
        
        .spamming {
            background: #ffeaa7;
            color: #d63031;
            border: 1px solid #fdcb6e;
        }

        #tmColorStatus {
            font-size: 12px;
            margin-top: 8px;
            padding: 8px;
            border-radius: 4px;
            text-align: center;
            font-weight: bold;
        }
    `);

    function initializeControlPanel() {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tmTogglePanel';
        toggleBtn.innerHTML = '⚙️';
        toggleBtn.title = 'Control Panel (Right Shift)';
        
        // Create control panel
        const controlPanel = document.createElement('div');
        controlPanel.id = 'tmControlPanel';
        controlPanel.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #3399ff; padding-bottom: 15px;">
                <h2 style="margin: 0; color: #3399ff; font-size: 22px;">🎮 Control Panel</h2>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">Press Right Shift to toggle</div>
            </div>
            
            <!-- Theme Section -->
            <div class="tm-section">
                <h3>🎨 Theme Customization</h3>
                <div>
                    <div style="margin: 10px 0; text-align: center;">
                        <button class="tm-button" data-theme="default">Default</button>
                        <button class="tm-button" data-theme="dark">Dark Mode</button>
                        <button class="tm-button" data-theme="blue">Ocean Blue</button>
                    </div>
                </div>
            </div>
            
            <!-- Name Management Section -->
            <div class="tm-section">
                <h3>👤 Name Management</h3>
                <div>
                    <input type="text" id="tmCustomName" class="tm-input" placeholder="Enter custom name" maxlength="15">
                    <button class="tm-button" id="tmSetCustomName">Set Name</button>
                    
                    <div style="margin: 10px 0;">
                        <button class="tm-button" data-name="Anonymous">Anonymous</button>
                        <button class="tm-button" data-name="Chatter">Chatter</button>
                        <button class="tm-button" data-name="User">User</button>
                    </div>
                </div>
            </div>
            
            <!-- Random Name Color Section -->
            <div class="tm-section">
                <h3>🌈 Random Name Color</h3>
                <div>
                    <input type="text" id="tmColorInterval" class="tm-input" placeholder="Cycle time (e.g., 3s, 10m)" value="3s">
                    <button class="tm-button success" id="tmStartColorCycle">Start Color Cycle</button>
                    <button class="tm-button danger" id="tmStopColorCycle">Stop Color Cycle</button>
                    <div style="font-size: 12px; color: #666; margin-top: 8px;">
                        Examples: "3s" for 3 seconds, "500ms" for 500 milliseconds, "10m" for 10 minutes.
                    </div>
                    <div id="tmColorStatus">Ready - Will click color dots automatically</div>
                </div>
            </div>
            
            <!-- Automation Section -->
            <div class="tm-section">
                <h3>⚡ Auto Messages</h3>
                <div>
                    <input type="text" id="tmAutoMessage" class="tm-input" placeholder="Message to send automatically">
                    <div style="display: flex; gap: 5px; margin: 8px 0;">
                        <input type="number" id="tmInterval" class="tm-input" placeholder="Interval (ms)" value="2000" min="500" style="flex: 1;">
                        <input type="number" id="tmCount" class="tm-input" placeholder="Count" value="5" min="1" style="flex: 1;">
                    </div>
                    <button class="tm-button success" id="tmStartSpam">Start</button>
                    <button class="tm-button danger" id="tmStopSpam">Stop</button>
                    <div id="tmSpamStatus">Ready</div>
                </div>
            </div>
            
            <!-- Quick Actions Section -->
            <div class="tm-section">
                <h3>🚀 Quick Actions</h3>
                <div>
                    <button class="tm-button" id="tmClearChat">Clear Chat</button>
                    <button class="tm-button" id="tmEnableSend">Always Enable Send</button>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 15px;">
                <button class="tm-button danger" id="tmClosePanel">Close</button>
            </div>
        `;
        
        // Add elements to page
        document.body.appendChild(toggleBtn);
        document.body.appendChild(controlPanel);
        
        // State variables
        let spamInterval = null;
        let spamCount = 0;
        let totalSpam = 0;
        let colorCycleInterval = null;
        
        // Event Listeners
        toggleBtn.addEventListener('click', togglePanel);
        
        document.getElementById('tmClosePanel').addEventListener('click', togglePanel);
        
        // Theme management
        document.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', function() {
                applyTheme(this.dataset.theme);
            });
        });
        
        // Name management
        document.getElementById('tmSetCustomName').addEventListener('click', setCustomName);
        document.querySelectorAll('[data-name]').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('tmCustomName').value = this.dataset.name;
                setCustomName();
            });
        });
        
        // Random Name Color - Click color dots automatically
        document.getElementById('tmStartColorCycle').addEventListener('click', startColorCycle);
        document.getElementById('tmStopColorCycle').addEventListener('click', stopColorCycle);
        
        // Automation
        document.getElementById('tmStartSpam').addEventListener('click', startSpamming);
        document.getElementById('tmStopSpam').addEventListener('click', stopSpamming);
        
        // Quick actions
        document.getElementById('tmClearChat').addEventListener('click', clearChat);
        document.getElementById('tmEnableSend').addEventListener('click', enableSendButton);
        
        // Right Shift key detection
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Shift' && event.location === 2) { // Right Shift
                togglePanel();
                event.preventDefault();
            }
        });
        
        // Functions
        function togglePanel() {
            const isActive = controlPanel.classList.contains('active');
            controlPanel.classList.toggle('active', !isActive);
        }
        
        function applyTheme(theme) {
            const styles = {
                default: { bg: '#ffffff', text: '#000000', accent: '#3399ff' },
                dark: { bg: '#1a1a1a', text: '#ffffff', accent: '#bb86fc' },
                blue: { bg: '#e3f2fd', text: '#0d47a1', accent: '#2196f3' }
            };
            
            const style = styles[theme] || styles.default;
            document.body.style.backgroundColor = style.bg;
            document.body.style.color = style.text;
            
            // Try to find and style the header if it exists
            const header = document.querySelector('header');
            if (header) {
                header.style.backgroundColor = style.accent;
            }
        }
        
        function setCustomName() {
            const customName = document.getElementById('tmCustomName').value.trim();
            if (customName) {
                const usernameInput = document.getElementById('usernameInput');
                const saveNameBtn = document.getElementById('saveNameBtn');
                
                if (usernameInput && saveNameBtn) {
                    usernameInput.value = customName;
                    saveNameBtn.click();
                } else {
                    console.log('Username input or save button not found');
                }
            }
        }
        
        function startColorCycle() {
            // Stop any existing cycle first
            stopColorCycle();

            const intervalString = document.getElementById('tmColorInterval').value.trim();
            const totalMilliseconds = parseInterval(intervalString);

            if (isNaN(totalMilliseconds) || totalMilliseconds <= 0) {
                updateColorStatus('Please enter a valid time (e.g., 3s, 2m, 1000ms).', 'error');
                return;
            }

            // Available colors from the website's color dots
            const availableColors = [
                "#e74c3c", // Red
                "#27ae60", // Green  
                "#f1c40f", // Yellow
                "#2980b9", // Blue
                "#e67e22", // Orange
                "#8e44ad", // Purple
                "#ff69b4"  // Pink
            ];

            let currentColorIndex = 0;

            colorCycleInterval = setInterval(() => {
                // Get all color dots from the website
                const colorDots = document.querySelectorAll('#colorDots .color-dot:not(.none)');
                
                if (colorDots.length > 0) {
                    // Cycle through available colors
                    const targetColor = availableColors[currentColorIndex];
                    
                    // Find the dot that matches our target color
                    let targetDot = null;
                    for (let dot of colorDots) {
                        if (dot.style.backgroundColor === targetColor || 
                            dot.style.backgroundColor === rgbToHex(targetColor)) {
                            targetDot = dot;
                            break;
                        }
                    }
                    
                    // If we found a matching dot, click it
                    if (targetDot) {
                        targetDot.click();
                        updateColorStatus(`Color changed to: ${targetColor}`, 'success');
                    } else {
                        // Fallback: click a random color dot
                        const randomIndex = Math.floor(Math.random() * colorDots.length);
                        colorDots[randomIndex].click();
                        updateColorStatus('Color changed randomly', 'success');
                    }
                    
                    // Move to next color
                    currentColorIndex = (currentColorIndex + 1) % availableColors.length;
                } else {
                    updateColorStatus('No color dots found on page', 'error');
                    stopColorCycle();
                }
            }, totalMilliseconds);

            updateColorStatus(`Color cycle started! Changing every ${intervalString}`, 'success');
        }

        function stopColorCycle() {
            if (colorCycleInterval) {
                clearInterval(colorCycleInterval);
                colorCycleInterval = null;
                updateColorStatus('Color cycle stopped.', 'stopped');
            }
        }

        function parseInterval(intervalString) {
            const match = intervalString.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m)?$/);
            if (!match) return NaN;

            const value = parseFloat(match[1]);
            const unit = match[2] || 's'; // Default to seconds

            switch (unit) {
                case 'ms':
                    return value;
                case 's':
                    return value * 1000;
                case 'm':
                    return value * 1000 * 60;
                default:
                    return NaN;
            }
        }

        function rgbToHex(rgb) {
            // Convert RGB color to hex format
            if (rgb.startsWith('#')) return rgb;
            
            const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
            if (!result) return rgb;
            
            const r = parseInt(result[1]);
            const g = parseInt(result[2]);
            const b = parseInt(result[3]);
            
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        }

        function updateColorStatus(message, type) {
            const statusEl = document.getElementById('tmColorStatus');
            if (statusEl) {
                statusEl.textContent = message;
                statusEl.style.color = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#666';
                statusEl.style.fontWeight = 'bold';
                statusEl.style.padding = '8px';
                statusEl.style.borderRadius = '4px';
                statusEl.style.backgroundColor = type === 'error' ? '#ffeaa7' : type === 'success' ? '#d4edda' : '#f8f9fa';
                statusEl.style.border = type === 'error' ? '1px solid #fdcb6e' : type === 'success' ? '1px solid #c3e6cb' : '1px solid #ddd';
            }
        }
        
        function startSpamming() {
            const message = document.getElementById('tmAutoMessage').value;
            const interval = parseInt(document.getElementById('tmInterval').value);
            const count = parseInt(document.getElementById('tmCount').value);
            
            if (!message) {
                updateSpamStatus('Please enter a message', 'error');
                return;
            }
            
            if (spamInterval) stopSpamming();
            
            totalSpam = count;
            spamCount = 0;
            
            spamInterval = setInterval(() => {
                if (spamCount >= totalSpam) {
                    stopSpamming();
                    return;
                }
                
                const chatInput = document.getElementById('chatInput');
                const sendBtn = document.getElementById('sendBtn');
                
                if (chatInput && sendBtn) {
                    // Enable button first if disabled
                    if (sendBtn.disabled) {
                        sendBtn.disabled = false;
                    }
                    
                    chatInput.value = message;
                    sendBtn.click();
                    spamCount++;
                    updateSpamStatus(`Sending... ${spamCount}/${totalSpam}`, 'spamming');
                } else {
                    updateSpamStatus('Chat input or send button not found', 'error');
                    stopSpamming();
                }
            }, interval);
            
            updateSpamStatus('Started auto-messaging', 'spamming');
        }
        
        function stopSpamming() {
            if (spamInterval) {
                clearInterval(spamInterval);
                spamInterval = null;
                updateSpamStatus(`Stopped. Sent ${spamCount} messages`, 'stopped');
            }
        }
        
        function updateSpamStatus(message, type) {
            const statusEl = document.getElementById('tmSpamStatus');
            statusEl.textContent = message;
            statusEl.className = type === 'spamming' ? 'spamming' : '';
        }
        
        function clearChat() {
            const messagesEl = document.getElementById('messages');
            if (messagesEl) {
                messagesEl.innerHTML = '';
            }
        }
        
        function enableSendButton() {
            const sendBtn = document.getElementById('sendBtn');
            if (sendBtn) {
                sendBtn.disabled = false;
                // Set up continuous monitoring to keep it enabled
                setInterval(() => {
                    if (sendBtn.disabled) {
                        sendBtn.disabled = false;
                    }
                }, 1000);
                updateSpamStatus('Send button always enabled', 'success');
            } else {
                updateSpamStatus('Send button not found', 'error');
            }
        }
    }
    
    // Wait for page to load completely before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeControlPanel);
    } else {
        initializeControlPanel();
    }
})();