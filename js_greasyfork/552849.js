// ==UserScript==
// @name         420's Shit Mod Menu (Unified Drag, Color + Size Picker, DOT OFFSET)
// @version      10.0-CROSSHAIR-FIX
// @description  Drag menu+launcher together, color & size picker for crosshair dot, hide/close behaviors, no M key.
// @match        https://games.crazygames.com/en_US/bullet-force-multiplayer/*
// @match        https://www.multiplayerpiano.dev/*
// @match        http://localhost:48897/game
// @match        https://www.gamepix.com/play/bullet-force
// @match        https://www.miniplay.com/game/bullet-force-multiplayer
// @match        https://kbhgames.com/game/bullet-force
// @match        https://bullet-force.com/
// @match        https://www.jopi.com/game/game/bullet-force/
// @match        https://www.gogy.com/games/bullet-force
// @match        https://www.gameflare.com/online-game/bullet-force/
// @match        https://www.silvergames.com/en/bullet-force
// @match        https://kour-io.com/bullet-force
// @grant        none
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1527535
// @downloadURL https://update.greasyfork.org/scripts/552849/420%27s%20Shit%20Mod%20Menu%20%28Unified%20Drag%2C%20Color%20%2B%20Size%20Picker%2C%20DOT%20OFFSET%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552849/420%27s%20Shit%20Mod%20Menu%20%28Unified%20Drag%2C%20Color%20%2B%20Size%20Picker%2C%20DOT%20OFFSET%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===========================
    //  SETTINGS (edit here)
    // ===========================

    // DO NOT CHANGE THESE CONSTANTS, THEY ARE USED FOR LOCAL STORAGE KEYS
    const LS_MODAL_LEFT = '420_modal_left';
    const LS_MODAL_TOP = '420_modal_top';
    const LS_MODAL_OPEN = '420_modal_open';
    const LS_CROSSHAIR_ON = '420_crosshair_on';
    const LS_CROSSHAIR_COLOR = '420_crosshair_color';
    const LS_CROSSHAIR_SIZE = '420_crosshair_size';
    const LS_CROSSHAIR_OFFSET_X = '420_crosshair_offset_x';
    const LS_CROSSHAIR_OFFSET_Y = '420_crosshair_offset_y';

    // Default values
    const DEFAULT_COLOR = '#ff0000'; // Default red
    const DEFAULT_SIZE = 5; // Default 5px size
    const DEFAULT_OFFSET = 0; // Default offset

    // Drag configuration
    const DRAG_THRESHOLD = 5;

    // Helper functions for Local Storage
    function writeLS(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Local storage write failed for key:', key, e);
        }
    }

    function readLS(key, defaultValue) {
        try {
            const stored = localStorage.getItem(key);
            if (stored === null) return defaultValue;
            return JSON.parse(stored);
        } catch (e) {
            console.error('Local storage read failed for key:', key, e);
            return defaultValue;
        }
    }

    // ===========================
    //  CROSSHAIR LOGIC
    // ===========================

    function createCrosshairIfNeeded() {
        let crosshair = document.getElementById('420-crosshair');
        if (!crosshair) {
            crosshair = document.createElement('div');
            crosshair.id = '420-crosshair';
            // Base styles: fixed position, centered
            crosshair.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 999999;
                pointer-events: none;
            `;
            document.body.appendChild(crosshair);
        }
        return crosshair;
    }

    function updateCrosshairStyle(color, size) {
        const crosshair = createCrosshairIfNeeded();

        // Get stored values or use defaults
        const chColor = color || readLS(LS_CROSSHAIR_COLOR, DEFAULT_COLOR);
        const chSize = size || readLS(LS_CROSSHAIR_SIZE, DEFAULT_SIZE);
        const chOffsetX = readLS(LS_CROSSHAIR_OFFSET_X, DEFAULT_OFFSET);
        const chOffsetY = readLS(LS_CROSSHAIR_OFFSET_Y, DEFAULT_OFFSET);

        // Apply styles
        crosshair.style.width = `${chSize}px`;
        crosshair.style.height = `${chSize}px`;
        crosshair.style.borderRadius = '50%';
        crosshair.style.backgroundColor = chColor;
        crosshair.style.transform = `translate(calc(-50% + ${chOffsetX}px), calc(-50% + ${chOffsetY}px))`;

        // Update visibility based on the toggle state
        if (readLS(LS_CROSSHAIR_ON, true)) {
            crosshair.style.display = 'block';
        } else {
            crosshair.style.display = 'none';
        }
    }

    function toggleCrosshair(isVisible) {
        const crosshair = createCrosshairIfNeeded();
        crosshair.style.display = isVisible ? 'block' : 'none';
        writeLS(LS_CROSSHAIR_ON, isVisible);
    }

    // ===========================
    //  MODAL HTML GENERATION
    // ===========================

    function createModal() {
        const existingContainer = document.getElementById('420-modal-container');
        if (existingContainer) return;

        const container = document.createElement('div');
        container.id = '420-modal-container';
        // Get initial position from LS or use defaults
        const left = readLS(LS_MODAL_LEFT, window.innerWidth / 2 - 200);
        const top = readLS(LS_MODAL_TOP, window.innerHeight / 2 - 150);
        const isOpen = readLS(LS_MODAL_OPEN, false);

        container.style.cssText = `
            position: fixed;
            left: ${left}px;
            top: ${top}px;
            z-index: 1000000;
            user-select: none;
            display: ${isOpen ? 'block' : 'none'};
            font-family: Arial, sans-serif;
        `;

        // The '420's Shit Mod Menu' Modal Structure
        container.innerHTML = `
            <div id="420-modal-card" style="
                background-color: #333;
                border: 2px solid #0f0;
                color: #fff;
                width: 300px;
                box-shadow: 0 4px 15px rgba(0, 255, 0, 0.4);
                border-radius: 8px;
                padding: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                cursor: grab; /* Enable dragging */
            ">
                <!-- Header (Draggable Area) -->
                <div id="420-modal-header" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid #555;
                ">
                    <h3 style="margin: 0; color: #0f0; font-size: 16px;">420's Shit Mod Menu</h3>
                    <!-- FIX: Added ID for close button and inline style -->
                    <button id="modal-close-button" style="
                        background: none;
                        border: none;
                        color: #f00;
                        font-size: 18px;
                        cursor: pointer;
                        padding: 0 5px;
                        line-height: 1;
                    ">X</button>
                </div>

                <!-- Content Area -->
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding: 5px 0;
                    cursor: default; /* Reset cursor for content area */
                ">

                    <!-- Crosshair Toggle Button -->
                    <button id="crosshair-toggle-button" style="
                        background-color: #222;
                        color: #0f0;
                        border: 1px solid #0f0;
                        padding: 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: background-color 0.2s;
                    ">
                        Toggle Crosshair (Current: ON)
                    </button>

                    <!-- Crosshair Color Picker -->
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label for="crosshair-color-picker" style="color: #ccc;">Crosshair Color:</label>
                        <input type="color" id="crosshair-color-picker" value="${readLS(LS_CROSSHAIR_COLOR, DEFAULT_COLOR)}" style="
                            padding: 0;
                            height: 25px;
                            width: 50px;
                            border: 1px solid #0f0;
                            background: none;
                            cursor: pointer;
                        ">
                    </div>

                    <!-- Crosshair Size Slider -->
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <label for="crosshair-size-slider" style="color: #ccc; display: flex; justify-content: space-between;">
                            <span>Crosshair Size:</span>
                            <span id="crosshair-size-value">${readLS(LS_CROSSHAIR_SIZE, DEFAULT_SIZE)}px</span>
                        </label>
                        <input type="range" id="crosshair-size-slider" min="1" max="20" step="1" value="${readLS(LS_CROSSHAIR_SIZE, DEFAULT_SIZE)}" style="width: 100%; cursor: pointer;">
                    </div>

                    <!-- Other Mod Buttons (Fewer buttons as requested) -->
                    <button style="background-color: #555; color: #fff; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                        Example Mod Button A
                    </button>
                    <button style="background-color: #555; color: #fff; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                        Example Mod Button B
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(container);
    }

    // ===========================
    //  TOGGLE BUTTON FOR MODAL
    // ===========================

    function createLauncherButton() {
        const button = document.createElement('button');
        button.id = '420-launcher-button';
        button.textContent = '420 Menu';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000000;
            background-color: #444;
            color: #0f0;
            border: 2px solid #0f0;
            padding: 10px 15px;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.2s, box-shadow 0.2s;
        `;

        button.addEventListener('click', () => {
            const modal = document.getElementById('420-modal-container');
            if (modal) {
                const isVisible = modal.style.display === 'none' || modal.style.display === '';
                modal.style.display = isVisible ? 'block' : 'none';
                writeLS(LS_MODAL_OPEN, isVisible);
            }
        });

        document.body.appendChild(button);
        return button;
    }

    // ===========================
    //  INITIALIZATION
    // ===========================

    window.addEventListener('load', () => {
        createModal();
        createLauncherButton();

        const container = document.getElementById('420-modal-container');
        const modalCard = document.getElementById('420-modal-card');
        const header = document.getElementById('420-modal-header');

        // --- Drag Logic Variables ---
        let isModalDragging = false;
        let startXModal, startYModal;
        let initialXModal, initialYModal;

        if (header) {
            header.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // Only left click
                isModalDragging = true;
                startXModal = e.clientX;
                startYModal = e.clientY;
                initialXModal = modalCard.offsetLeft;
                initialYModal = modalCard.offsetTop;
                modalCard.style.cursor = 'grabbing';
            });
        }

        document.addEventListener('mousemove', (e) => {
            if (!isModalDragging) return;

            const dx = e.clientX - startXModal;
            const dy = e.clientY - startYModal;

            let newLeft = initialXModal + dx;
            let newTop = initialYModal + dy;

            // Basic boundary checks
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modalCard.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - modalCard.offsetHeight));

            modalCard.style.left = newLeft + 'px';
            modalCard.style.top = newTop + 'px';
            container.style.left = newLeft + 'px';
            container.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isModalDragging) {
                isModalDragging = false;
                modalCard.style.cursor = 'grab';

                // Save new position
                writeLS(LS_MODAL_LEFT, container.offsetLeft);
                writeLS(LS_MODAL_TOP, container.offsetTop);
            }
        });

        // ===================================
        //  MODAL AND CROSSHAIR CONTROLS SETUP
        // ===================================

        // 1. FIX: Close Button Listener (The 'X')
        const modalClose = document.getElementById('modal-close-button');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                container.style.display = 'none';
                writeLS(LS_MODAL_OPEN, false);
            });
        }

        // 2. Crosshair State and Initial Style Application
        const isCrosshairOn = readLS(LS_CROSSHAIR_ON, true);
        const crosshairToggleButton = document.getElementById('crosshair-toggle-button');

        const updateToggleButtonText = () => {
             const state = readLS(LS_CROSSHAIR_ON, true) ? 'ON' : 'OFF';
             crosshairToggleButton.textContent = `Toggle Crosshair (Current: ${state})`;
             crosshairToggleButton.style.backgroundColor = state === 'ON' ? '#070' : '#700';
        };

        if (crosshairToggleButton) {
            updateToggleButtonText();
            crosshairToggleButton.addEventListener('click', () => {
                const newState = !readLS(LS_CROSSHAIR_ON, true);
                toggleCrosshair(newState);
                updateToggleButtonText();
            });
        }

        // Initial application of crosshair style based on saved/default settings
        updateCrosshairStyle();

        // 3. Crosshair Color Picker Listener (Instant Update)
        const colorPicker = document.getElementById('crosshair-color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                const newColor = e.target.value;
                writeLS(LS_CROSSHAIR_COLOR, newColor);
                updateCrosshairStyle(newColor); // Update with new color, size/offset read from LS
            });
        }

        // 4. Crosshair Size Slider Listener (Instant Update)
        const sizeSlider = document.getElementById('crosshair-size-slider');
        const sizeValueSpan = document.getElementById('crosshair-size-value');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                const newSize = parseInt(e.target.value);
                writeLS(LS_CROSSHAIR_SIZE, newSize);
                sizeValueSpan.textContent = `${newSize}px`;
                updateCrosshairStyle(null, newSize); // Update with new size, color/offset read from LS
            });
        }
    });

})();
