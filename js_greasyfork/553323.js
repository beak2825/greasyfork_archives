// ==UserScript==
// @name         Universal Auto-Scroll (Modified)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds auto-scrolling functionality to any website with true dynamic UI scaling and display sleep prevention.
// @author       MasuRii
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553323/Universal%20Auto-Scroll%20%28Modified%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553323/Universal%20Auto-Scroll%20%28Modified%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait a bit for page to be fully ready
    setTimeout(initAutoScroll, 1000);

    function initAutoScroll() {
        // ===================================================================
        // *** USER CUSTOMIZATION: CHANGE THIS VALUE TO RESIZE THE UI PANEL ***
        // 1.0 = default size. 0.8 = 80% size (smaller). 1.2 = 120% size (larger).
        const uiScaleFactor = 0.8;
        // ===================================================================

        // ===================================================================
        // *** USER CUSTOMIZATION: SCROLLING SPEED VALUES ***
        // These are the speed multipliers for the 9 pre-defined speed levels on the slider.
        // These values will be displayed as read-only in the panel.
        const speedMultipliers = [
            0.15, // Speed 1: Snail
            0.25, // Speed 2: Turtle
            0.35, // Speed 3: Leisurely
            0.38, // Speed 4: Relaxed
            0.5,  // Speed 5: Very Slow
            0.75, // Speed 6: Slow
            1.0,  // Speed 7: Medium (Default)
            1.5,  // Speed 8: Fast
            2.5   // Speed 9: Very Fast
        ];
        // ===================================================================

        // Configuration
        const DEFAULT_SETTINGS = {
            isActive: false,
            speed: 7, // Default is "Medium" on the new 1-10 scale
            isMinimized: false,
            pixelsPerSecond: 50,  // Base scrolling speed - will be modified by speed setting
            userSpeedMultiplier: 5.0 // Default value for the user-defined speed level
        };

        // State variables
        let isScrolling = false;
        let scrollIntervalId = null;
        let userScrollDetected = false;
        let userScrollTimeout = null;
        let lastScrollPosition = window.scrollY;
        let wakeLockSentinel = null; // For preventing display sleep

        // Load saved settings or use defaults
        let scrollSettings;
        try {
            const saved = JSON.parse(GM_getValue('autoScrollSettings', '{}'));
            scrollSettings = { ...DEFAULT_SETTINGS, ...saved }; // Merge saved settings with defaults
        } catch (e) {
            console.log('Could not load settings, using defaults');
            scrollSettings = DEFAULT_SETTINGS;
        }

        // DOM elements references
        let container;
        let autoScrollPanel;
        let bubbleView;
        let toggleButton;
        let speedSlider;
        let speedValue;
        let speedValueInput; // NEW: For the speed multiplier input box

        // Adjust panel size using CSS transform to counteract browser zoom
        function adjustPanelForZoom() {
            if (!window.visualViewport || !container) return;
            const browserZoom = window.visualViewport.scale;
            const finalScale = uiScaleFactor / browserZoom;
            container.style.transform = `scale(${finalScale})`;
            container.style.transformOrigin = 'bottom right';
        }

        // Create and inject the UI
        function createUI() {
            const containerId = 'auto-scroll-container-' + Math.random().toString(36).substr(2, 9);
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);

            const styleElement = document.createElement('style');
            styleElement.textContent = `
                #${containerId} {
                    all: initial; position: fixed; bottom: 80px; right: 20px; width: 220px; height: auto; z-index: 9999999;
                }
                #${containerId} * {
                    all: unset; box-sizing: border-box; font-family: Arial, sans-serif; color: white;
                }
                #${containerId} .auto-scroll-panel, #${containerId} .auto-scroll-bubble {
                    position: absolute; bottom: 0; right: 0;
                }
                #${containerId} .auto-scroll-panel {
                    background-color: rgba(0, 0, 0, 0.8); padding: 15px; border-radius: 8px; width: 220px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    display: ${scrollSettings.isMinimized ? 'none' : 'block'};
                }
                #${containerId} .panel-header {
                    display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 8px;
                }
                #${containerId} .panel-title { font-weight: bold; font-size: 16px; display: block; }
                #${containerId} .minimize-button { background: none; border: none; cursor: pointer; font-size: 20px; padding: 0; margin: 0; display: block; }
                #${containerId} .section { margin-bottom: 12px; }
                #${containerId} .section-title { font-size: 14px; color: #ffcc00; margin-bottom: 8px; display: block; }
                #${containerId} .toggle-button {
                    background-color: #2196F3; border: none; padding: 10px 15px; text-align: center; font-size: 14px; border-radius: 6px; width: 100%; cursor: pointer;
                    display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 10px;
                }
                #${containerId} .toggle-button.active { background-color: #4CAF50; }
                #${containerId} .slider-container { width: 100%; display: flex; flex-direction: column; gap: 8px; }
                #${containerId} .slider-top { display: flex; justify-content: space-between; width: 100%; font-size: 14px; }
                #${containerId} .speed-value { font-weight: bold; }
                #${containerId} .speed-slider {
                    width: 100%; height: 5px; -webkit-appearance: none; appearance: none; background: #444; outline: none; border-radius: 3px; display: block;
                }
                #${containerId} .speed-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 15px; height: 15px; border-radius: 50%; background: #ffcc00; cursor: pointer; }
                #${containerId} .speed-slider::-moz-range-thumb { width: 15px; height: 15px; border-radius: 50%; background: #ffcc00; cursor: pointer; }
                #${containerId} .slider-labels { display: flex; justify-content: space-between; width: 100%; font-size: 12px; }
                #${containerId} .auto-scroll-bubble {
                    width: 60px; height: 60px; border-radius: 50%; background-color: rgba(0, 0, 0, 0.8); display: ${scrollSettings.isMinimized ? 'flex' : 'none'};
                    flex-direction: column; justify-content: center; align-items: center; cursor: pointer; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); font-size: 24px;
                }
                /* NEW STYLES for speed value input */
                #${containerId} .speed-value-container { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 14px; }
                #${containerId} .speed-value-input {
                    width: 60px; background-color: #333; border: 1px solid #555; border-radius: 4px; padding: 4px 8px; text-align: center; font-size: 14px;
                }
                #${containerId} .speed-value-input:disabled { background-color: #222; color: #888; cursor: not-allowed; }
            `;
            document.head.appendChild(styleElement);

            autoScrollPanel = document.createElement('div');
            autoScrollPanel.className = 'auto-scroll-panel';
            container.appendChild(autoScrollPanel);

            // ... (Panel Header and Status Section are unchanged)
            const panelHeader = document.createElement('div');
            panelHeader.className = 'panel-header';
            const panelTitle = document.createElement('div');
            panelTitle.className = 'panel-title';
            panelTitle.textContent = 'Auto-Scroll Controls';
            const minimizeButton = document.createElement('button');
            minimizeButton.className = 'minimize-button';
            minimizeButton.textContent = '−';
            minimizeButton.addEventListener('click', toggleMinimize);
            panelHeader.appendChild(panelTitle);
            panelHeader.appendChild(minimizeButton);
            autoScrollPanel.appendChild(panelHeader);

            const statusSection = document.createElement('div');
            statusSection.className = 'section';
            const statusTitle = document.createElement('div');
            statusTitle.className = 'section-title';
            statusTitle.textContent = 'Scrolling Status';
            toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-button' + (scrollSettings.isActive ? ' active' : '');
            toggleButton.innerHTML = scrollSettings.isActive ? '<span>⏸️</span> Pause Scrolling' : '<span>▶️</span> Start Scrolling';
            toggleButton.addEventListener('click', toggleScrolling);
            statusSection.appendChild(statusTitle);
            statusSection.appendChild(toggleButton);
            autoScrollPanel.appendChild(statusSection);


            // --- Speed Section (Modified) ---
            const speedSection = document.createElement('div');
            speedSection.className = 'section';
            const speedTitle = document.createElement('div');
            speedTitle.className = 'section-title';
            speedTitle.textContent = 'Scroll Speed';
            const sliderContainer = document.createElement('div');
            sliderContainer.className = 'slider-container';
            const sliderTop = document.createElement('div');
            sliderTop.className = 'slider-top';
            const speedLabel = document.createElement('span');
            speedLabel.textContent = 'Speed:';
            speedValue = document.createElement('span');
            speedValue.className = 'speed-value';
            sliderTop.appendChild(speedLabel);
            sliderTop.appendChild(speedValue);
            speedSlider = document.createElement('input');
            speedSlider.type = 'range';
            speedSlider.className = 'speed-slider';
            speedSlider.min = '1';
            speedSlider.max = '10'; // Increased max to 10 for custom speed
            speedSlider.value = scrollSettings.speed;
            speedSlider.addEventListener('input', handleSpeedChange);
            const sliderLabels = document.createElement('div');
            sliderLabels.className = 'slider-labels';
            const slowLabel = document.createElement('span');
            slowLabel.textContent = 'Slow';
            const fastLabel = document.createElement('span');
            fastLabel.textContent = 'Fast';
            sliderLabels.appendChild(slowLabel);
            sliderLabels.appendChild(fastLabel);
            sliderContainer.appendChild(sliderTop);
            sliderContainer.appendChild(speedSlider);
            sliderContainer.appendChild(sliderLabels);
            speedSection.appendChild(speedTitle);
            speedSection.appendChild(sliderContainer);

            // --- NEW: Speed Value Input Section ---
            const speedValueContainer = document.createElement('div');
            speedValueContainer.className = 'speed-value-container';
            const speedValueLabel = document.createElement('span');
            speedValueLabel.textContent = 'Speed Multiplier:';
            speedValueInput = document.createElement('input');
            speedValueInput.type = 'number';
            speedValueInput.className = 'speed-value-input';
            speedValueInput.step = '0.1';
            speedValueInput.min = '0.1';
            speedValueInput.addEventListener('input', handleUserSpeedInputChange);
            speedValueContainer.appendChild(speedValueLabel);
            speedValueContainer.appendChild(speedValueInput);
            speedSection.appendChild(speedValueContainer);

            autoScrollPanel.appendChild(speedSection);

            // ... (Bubble View is unchanged)
            bubbleView = document.createElement('div');
            bubbleView.className = 'auto-scroll-bubble';
            bubbleView.innerHTML = '📜';
            bubbleView.addEventListener('click', toggleMinimize);
            container.appendChild(bubbleView);

            // --- Initial UI State Setup ---
            updateSpeedDisplay(scrollSettings.speed);
            updateSpeedValueInputState(scrollSettings.speed);
            if (scrollSettings.isActive) {
                startScrolling();
            }
        }

        function toggleMinimize() {
            scrollSettings.isMinimized = !scrollSettings.isMinimized;
            autoScrollPanel.style.display = scrollSettings.isMinimized ? 'none' : 'block';
            bubbleView.style.display = scrollSettings.isMinimized ? 'flex' : 'none';
            saveSettings();
        }

        function toggleScrolling() {
            scrollSettings.isActive = !scrollSettings.isActive;
            if (scrollSettings.isActive) {
                toggleButton.classList.add('active');
                toggleButton.innerHTML = '<span>⏸️</span> Pause Scrolling';
                startScrolling();
            } else {
                toggleButton.classList.remove('active');
                toggleButton.innerHTML = '<span>▶️</span> Start Scrolling';
                stopScrolling();
            }
            saveSettings();
        }

        function handleSpeedChange() {
            const value = parseInt(speedSlider.value);
            scrollSettings.speed = value;
            updateSpeedDisplay(value);
            updateSpeedValueInputState(value); // NEW: Update the input box state
            if (isScrolling) {
                stopScrolling();
                startScrolling();
            }
            saveSettings();
        }

        // NEW: Handle user input in the custom speed box
        function handleUserSpeedInputChange() {
            const newSpeed = parseFloat(speedValueInput.value);
            if (!isNaN(newSpeed) && newSpeed > 0) {
                scrollSettings.userSpeedMultiplier = newSpeed;
                saveSettings();
                if (isScrolling) {
                    stopScrolling();
                    startScrolling();
                }
            }
        }

        function updateSpeedDisplay(value) {
            let speedText;
            if (value === 1) speedText = "Snail";
            else if (value === 2) speedText = "Turtle";
            else if (value === 3) speedText = "Leisurely";
            else if (value === 4) speedText = "Relaxed";
            else if (value === 5) speedText = "Very Slow";
            else if (value === 6) speedText = "Slow";
            else if (value === 7) speedText = "Medium";
            else if (value === 8) speedText = "Fast";
            else if (value === 9) speedText = "Very Fast";
            else speedText = "Custom"; // Level 10
            speedValue.textContent = `${speedText} (${value})`;
        }

        // NEW: Update the state (value and disabled status) of the speed multiplier input box
        function updateSpeedValueInputState(value) {
            if (value < 10) {
                speedValueInput.value = speedMultipliers[value - 1];
                speedValueInput.disabled = true;
            } else { // value is 10 (Custom)
                speedValueInput.value = scrollSettings.userSpeedMultiplier;
                speedValueInput.disabled = false;
            }
        }

        async function requestWakeLock() {
            if ('wakeLock' in navigator && wakeLockSentinel === null) {
                try {
                    wakeLockSentinel = await navigator.wakeLock.request('screen');
                    wakeLockSentinel.addEventListener('release', () => { wakeLockSentinel = null; });
                } catch (err) {
                    console.error(`Auto-Scroll Wake Lock Error: ${err.name}, ${err.message}`);
                }
            }
        }

        async function releaseWakeLock() {
            if (wakeLockSentinel !== null) {
                await wakeLockSentinel.release();
                wakeLockSentinel = null;
            }
        }

        function startScrolling() {
            if (isScrolling) return;
            isScrolling = true;
            lastScrollPosition = window.scrollY;
            requestWakeLock();

            let currentMultiplier;
            if (scrollSettings.speed < 10) {
                currentMultiplier = speedMultipliers[scrollSettings.speed - 1];
            } else {
                currentMultiplier = scrollSettings.userSpeedMultiplier;
            }

            const pixelsPerSecond = DEFAULT_SETTINGS.pixelsPerSecond * currentMultiplier;
            const scrollDelay = Math.floor(1000 / pixelsPerSecond);
            scrollIntervalId = setInterval(() => {
                if (!userScrollDetected) {
                    window.scrollBy(0, 1);
                }
            }, scrollDelay);
        }

        function stopScrolling() {
            if (!isScrolling) return;
            isScrolling = false;
            releaseWakeLock();
            if (scrollIntervalId !== null) {
                clearInterval(scrollIntervalId);
                scrollIntervalId = null;
            }
        }

        function saveSettings() {
            try {
                GM_setValue('autoScrollSettings', JSON.stringify(scrollSettings));
            } catch (e) {
                console.error('Failed to save settings:', e);
            }
        }

        function handleUserScroll() {
            const currentPosition = window.scrollY;
            if (isScrolling && Math.abs(currentPosition - lastScrollPosition) > 3) {
                userScrollDetected = true;
                if (userScrollTimeout) clearTimeout(userScrollTimeout);
                userScrollTimeout = setTimeout(() => {
                    userScrollDetected = false;
                    lastScrollPosition = window.scrollY;
                }, 5000);
            }
            lastScrollPosition = currentPosition;
        }

        function handleVisibilityChange() {
            if (document.visibilityState === 'visible' && isScrolling) {
                requestWakeLock();
            }
        }

        if (document.body && document.body.scrollHeight > window.innerHeight) {
            createUI();
            if (window.visualViewport) {
                adjustPanelForZoom(); // Initial adjustment
                window.visualViewport.addEventListener('resize', adjustPanelForZoom);
            }
            window.addEventListener('scroll', handleUserScroll, { passive: true });
            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('beforeunload', () => {
                stopScrolling();
                if (window.visualViewport) {
                    window.visualViewport.removeEventListener('resize', adjustPanelForZoom);
                }
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            });
        }
    }
})();