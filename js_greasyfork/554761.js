// ==UserScript==
// @name         Drawaria Winter Palettes 🎄🎨 (Floating Menu)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Creates a floating menu to switch between the original Drawaria palette and a thematic Winter palette. Includes the chaotic "Eccentric Relative" event.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://*.drawaria.online/*
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554761/Drawaria%20Winter%20Palettes%20%F0%9F%8E%84%F0%9F%8E%A8%20%28Floating%20Menu%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554761/Drawaria%20Winter%20Palettes%20%F0%9F%8E%84%F0%9F%8E%A8%20%28Floating%20Menu%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 0. PALETTE DEFINITION ---
    const ORIGINAL_COLORS_HEX = [
        '#000000', '#ffffff', '#7F7F7F', '#ff0000', '#00ff00', '#0000ff',
        '#93cfff', '#ffff00', '#ff9300', '#7f007f', '#ffbfff',
        // Default custom colors (will try to preserve/replicate)
        'rgb(212, 255, 240)', 'rgb(242, 242, 242)', 'rgb(255, 233, 194)',
        'rgb(82, 49, 235)', 'rgb(128, 0, 0)', 'rgb(255, 0, 72)'
    ];

    const WINTER_PALETTE = [
        '#ffffff', '#000000', '#939393', '#c0392b', '#0b5345', '#1f618d',
        '#a9cce3', '#f1c40f', '#f7dc6f', '#78281f', '#d4e6f1',
        // Thematic custom colors (to replace default customs)
        '#ecf0f1', '#839192', '#ffcba4', '#7d3c98', '#641e16', '#e9967a'
    ];

    // Helper function to generate a random hex color
    function getRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }

    // Storage for script state
    let clonedControls = null;
    let chaosTimer = null;
    let isChaosActive = false;
    let currentPalette = 'winter'; // Initial state

    // --- 1. CUSTOM STYLES (GM_addStyle) ---
    GM_addStyle(`
        /* Snowy Cabin Ambiance */
        body {
            background-image: url('https://img.freepik.com/free-vector/hand-drawn-winter-landscape-background_23-2147984296.jpg?semt=ais_hybrid&w=740&q=80') !important;
            background-size: cover !important;
            background-attachment: fixed !important;
            background-color: #333 !important;
        }
        .wrapper {
            background-color: rgba(255, 255, 255, 0.95) !important;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.7) !important;
        }

        /* Custom Floating Menu */
        #customPaletteMenu {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 250px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
            transition: right 0.3s ease; /* Transition only 'right' property */
        }
        #customPaletteMenu.closed {
            right: -240px; /* Hide most of the menu, leaving only the button */
        }
        #toggleMenuButton {
            position: absolute;
            left: -50px; /* Bigger button means we need to move it more to the left */
            top: 0;
            background: #1f618d;
            color: white;
            border: none;
            padding: 8px 10px; /* Bigger padding */
            border-radius: 8px 0 0 8px;
            cursor: pointer;
            line-height: 1;
            font-size: 1.5em; /* Larger icon */
        }

        /* Preview Control Styling Fixes */
        #clonedDrawControls {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
            border: 1px dashed #ccc;
            padding: 5px;
            border-radius: 4px;
        }
        /* Ensure all color buttons are visible and styled correctly in the preview */
        #clonedDrawControls .drawcontrols-button {
            display: flex !important; /* Force visibility */
            margin: 2px !important;
            cursor: pointer;
        }
        #clonedDrawControls .drawcontrols-sep,
        #clonedDrawControls .drawcontrols-dialogbutton,
        #clonedDrawControls .drawcontrols-widthtoggle,
        #clonedDrawControls .drawcontrols-toolstoggle {
            /* Hide non-color elements from the cloned preview */
            display: none !important;
        }

        /* Palette Option Buttons */
        #paletteOptions button {
            margin: 3px 0;
            width: 100%;
            padding: 5px;
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        #paletteOptions button.active {
            background: #1f618d;
            color: white;
        }
    `);

    // --- 2. PALETTE LOGIC FUNCTIONS ---

    // Function to get the current colors from the original palette
    function getOriginalPalette(drawControlsElement) {
        const buttons = drawControlsElement.querySelectorAll('.drawcontrols-color');
        const colors = [];
        buttons.forEach(button => {
             // Only take the first 17 colors (the default visible spots)
             if (colors.length < 17) {
                const color = button.style.backgroundColor || button.style.background;
                if (color) {
                    colors.push(color);
                }
            }
        });
        return colors.length >= 17 ? colors : ORIGINAL_COLORS_HEX; // Fallback
    }


    // Main function to apply the palette to the *clone* and the *original*
    function applyPalette(palette) {
        const originalControls = document.getElementById('drawcontrols');
        if (!originalControls || !clonedControls) return;

        // 1. Apply to Original Control (for drawing)
        const originalButtons = originalControls.querySelectorAll('.drawcontrols-color');
        originalButtons.forEach((button, index) => {
            // Ensure not to affect the last button (colorpicker/dialog)
            if (index < originalButtons.length - 1) {
                const color = palette[index % palette.length];
                button.style.backgroundColor = color;
                button.style.background = color;
            }
        });

        // 2. Apply to Cloned Control (for menu visualization)
        const clonedButtons = clonedControls.querySelectorAll('.drawcontrols-color');
        clonedButtons.forEach((button, index) => {
            if (index < clonedButtons.length - 1) {
                const color = palette[index % palette.length];
                button.style.backgroundColor = color;
                button.style.background = color;
            }
        });

        // 3. Update the visual state of the menu buttons
        document.querySelectorAll('#paletteOptions button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.getElementById(`btn-${currentPalette}`);
        if(activeBtn) activeBtn.classList.add('active');
    }

    // --- 3. FLOATING MENU CREATION ---

    function createFloatingMenu() {
        const originalControls = document.getElementById('drawcontrols');
        if (!originalControls) {
            console.warn('Draw controls not found. Retrying in 500ms...');
            setTimeout(createFloatingMenu, 500);
            return;
        }

        // **Cloning the Color Buttons Only**
        const colorButtonsContainer = document.createElement('div');
        originalControls.querySelectorAll('.drawcontrols-color').forEach(button => {
            // Clone only the color buttons
            colorButtonsContainer.appendChild(button.cloneNode(true));
        });

        clonedControls = colorButtonsContainer;
        clonedControls.id = 'clonedDrawControls';

        // Create the main menu
        const menu = document.createElement('div');
        menu.id = 'customPaletteMenu';
        menu.className = 'closed'; // Initially closed

        // Toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggleMenuButton';
        toggleButton.innerHTML = '🎨';
        toggleButton.title = 'Toggle Winter Palette Menu';
        toggleButton.onclick = () => menu.classList.toggle('closed');
        menu.appendChild(toggleButton);

        // Options Container
        const optionsContainer = document.createElement('div');
        optionsContainer.innerHTML = '<h4>Winter Palettes</h4>';
        optionsContainer.id = 'paletteOptions';

        // Palette Selection Buttons
        const palettes = [
            { id: 'original', name: 'Original Palette', colors: getOriginalPalette(originalControls) },
            { id: 'winter', name: 'Winter Palette', colors: WINTER_PALETTE }
        ];

        palettes.forEach(p => {
            const btn = document.createElement('button');
            btn.id = `btn-${p.id}`;
            btn.innerText = p.name;
            btn.onclick = () => {
                currentPalette = p.id;
                applyPalette(p.colors);
            };
            optionsContainer.appendChild(btn);
        });

        menu.appendChild(optionsContainer);
        menu.appendChild(document.createElement('hr'));
        menu.appendChild(document.createElement('h5')).innerText = 'Preview:';
        menu.appendChild(clonedControls);

        document.body.appendChild(menu);

        // Initialize the palette to Winter
        applyPalette(WINTER_PALETTE);
    }

    // --- 4. CHAOS LOGIC (ECCENTRIC RELATIVE) ---

    function triggerChaosExchange() {
        if (isChaosActive) return;
        isChaosActive = true;

        const body = document.body;
        // Get the active palette to revert to it later
        const paletteToRevert = currentPalette === 'winter' ? WINTER_PALETTE : getOriginalPalette(document.getElementById('drawcontrols'));

        // 4.1. Visual Swap (Full-screen filter)
        body.style.transition = 'filter 0.5s ease-in-out';
        body.style.filter = 'hue-rotate(90deg) contrast(150%)';

        // 4.2. Palette Swap to Random Colors (Double Chaos)
        const chaoticPalette = Array.from({length: paletteToRevert.length}, () => getRandomColor());
        applyPalette(chaoticPalette);

        // 4.3. Surprise Message
        const chatPanel = document.querySelector('.chat-messages-container');
        if (chatPanel) {
            const surpriseMessage = document.createElement('div');
            surpriseMessage.className = 'chat-message system-message';
            surpriseMessage.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            surpriseMessage.innerHTML = '<b>[The Swap Rule]</b>: Surprise! The eccentric relative has changed everything for 10 seconds. DRAW FAST!';
            chatPanel.appendChild(surpriseMessage);
            chatPanel.scrollTop = chatPanel.scrollHeight;
        }

        // 4.4. Undo Chaos after 10 seconds
        chaosTimer = setTimeout(() => {
            body.style.filter = 'none'; // Remove visual filter
            applyPalette(paletteToRevert); // Revert to the previously active palette
            isChaosActive = false;
        }, 10000);
    }

    // --- 5. IMPLEMENTATION: THE TRIGGER (Chaos Interval) ---
    function setupChaosInterval() {
        const minTime = 300000; // 5 minutes
        const maxTime = 600000; // 10 minutes
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;

        setTimeout(() => {
            triggerChaosExchange();
            setupChaosInterval();
        }, randomTime);
    }


    // Wait for the document body to be fully loaded to manipulate elements
    window.addEventListener('load', () => {
        createFloatingMenu();
        setupChaosInterval();
    });

})();