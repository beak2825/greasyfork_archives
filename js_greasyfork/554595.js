// ==UserScript==
    // @name         Torn: More Legible Player Names
    // @version      3.0
    // @description  Replaces Torn's pixel honor bar names with a larger, more legible font, while maintaining color outlines for staff roles and those that opt to display blue name. Includes customizable font sizes and player-specific outline colors.
    // @author       GingerBeardMan
    // @match        https://www.torn.com/*
    // @grant        none
    // @license	 GNU GPLv3
// @namespace https://greasyfork.org/users/1531859
// @downloadURL https://update.greasyfork.org/scripts/554595/Torn%3A%20More%20Legible%20Player%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/554595/Torn%3A%20More%20Legible%20Player%20Names.meta.js
    // ==/UserScript==

    (function () {
        'use strict';

        // ==================== LOCALSTORAGE MANAGEMENT ====================

        function getSettings() {
            return {
                currentUserId: localStorage.getItem('mlpn_currentUserId') || null,
                fontSize: parseInt(localStorage.getItem('mlpn_fontSize')) || 12,
                myTextColor: localStorage.getItem('mlpn_myTextColor') || '#ffffff',
                myColor: localStorage.getItem('mlpn_myColor') || '#ffffff',
                playerTextColors: JSON.parse(localStorage.getItem('mlpn_playerTextColors') || '{}'),
                playerColors: JSON.parse(localStorage.getItem('mlpn_playerColors') || '{}')
            };
        }

        function saveSettings(settings) {
            if (settings.currentUserId) localStorage.setItem('mlpn_currentUserId', settings.currentUserId);
            if (settings.fontSize) localStorage.setItem('mlpn_fontSize', settings.fontSize.toString());
            if (settings.myTextColor) localStorage.setItem('mlpn_myTextColor', settings.myTextColor);
            if (settings.myColor) localStorage.setItem('mlpn_myColor', settings.myColor);
            if (settings.playerTextColors) localStorage.setItem('mlpn_playerTextColors', JSON.stringify(settings.playerTextColors));
            if (settings.playerColors) localStorage.setItem('mlpn_playerColors', JSON.stringify(settings.playerColors));
        }

        // Extract and save current user ID
        function extractUserId() {
            const userInput = document.querySelector('#torn-user');
            if (userInput) {
                try {
                    const userData = JSON.parse(userInput.value);
                    if (userData.id) {
                        localStorage.setItem('mlpn_currentUserId', userData.id);
                        return userData.id;
                    }
                } catch (e) {
                    console.error('MLPN: Error parsing user data', e);
                }
            }
            return null;
        }

        // 147 CSS Named Colors
        const CSS_COLORS = [
            'AliceBlue', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Azure', 'Beige', 'Bisque', 'Black', 'BlanchedAlmond', 'Blue',
            'BlueViolet', 'Brown', 'BurlyWood', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Cornsilk', 'Crimson',
            'Cyan', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGrey', 'DarkGreen', 'DarkKhaki', 'DarkMagenta', 'DarkOliveGreen',
            'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkSlateGrey', 'DarkTurquoise', 'DarkViolet',
            'DeepPink', 'DeepSkyBlue', 'DimGray', 'DimGrey', 'DodgerBlue', 'FireBrick', 'FloralWhite', 'ForestGreen', 'Fuchsia', 'Gainsboro',
            'GhostWhite', 'Gold', 'GoldenRod', 'Gray', 'Grey', 'Green', 'GreenYellow', 'HoneyDew', 'HotPink', 'IndianRed',
            'Indigo', 'Ivory', 'Khaki', 'Lavender', 'LavenderBlush', 'LawnGreen', 'LemonChiffon', 'LightBlue', 'LightCoral', 'LightCyan',
            'LightGoldenRodYellow', 'LightGray', 'LightGrey', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSlateGrey',
            'LightSteelBlue', 'LightYellow', 'Lime', 'LimeGreen', 'Linen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid',
            'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumSpringGreen', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'MintCream', 'MistyRose', 'Moccasin',
            'NavajoWhite', 'Navy', 'OldLace', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleGoldenRod', 'PaleGreen',
            'PaleTurquoise', 'PaleVioletRed', 'PapayaWhip', 'PeachPuff', 'Peru', 'Pink', 'Plum', 'PowderBlue', 'Purple', 'RebeccaPurple',
            'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'SeaShell', 'Sienna', 'Silver',
            'SkyBlue', 'SlateBlue', 'SlateGray', 'SlateGrey', 'Snow', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Thistle',
            'Tomato', 'Turquoise', 'Violet', 'Wheat', 'White', 'WhiteSmoke', 'Yellow', 'YellowGreen'
        ];

        // Sort colors by hue for better visual organization
        function sortColorsByHue() {
            // Convert color name to RGB, then to HSL
            function colorToHSL(colorName) {
                const canvas = document.createElement('canvas');
                canvas.width = canvas.height = 1;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = colorName;
                ctx.fillRect(0, 0, 1, 1);
                const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

                const rNorm = r / 255;
                const gNorm = g / 255;
                const bNorm = b / 255;

                const max = Math.max(rNorm, gNorm, bNorm);
                const min = Math.min(rNorm, gNorm, bNorm);
                const diff = max - min;

                let h = 0;
                let s = 0;
                const l = (max + min) / 2;

                if (diff !== 0) {
                    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

                    switch (max) {
                        case rNorm: h = ((gNorm - bNorm) / diff + (gNorm < bNorm ? 6 : 0)) / 6; break;
                        case gNorm: h = ((bNorm - rNorm) / diff + 2) / 6; break;
                        case bNorm: h = ((rNorm - gNorm) / diff + 4) / 6; break;
                    }
                }

                return { h, s, l, name: colorName };
            }

            const colorsWithHSL = CSS_COLORS.map(colorToHSL);

            // Sort by hue, then saturation, then lightness
            return colorsWithHSL.sort((a, b) => {
                if (Math.abs(a.h - b.h) > 0.01) return a.h - b.h;
                if (Math.abs(a.s - b.s) > 0.01) return b.s - a.s;
                return a.l - b.l;
            }).map(c => c.name);
        }

        const SORTED_CSS_COLORS = sortColorsByHue();

        // Load Manrope font
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        // Inject styling
        const style = document.createElement('style');
        style.textContent = `
            .custom-honor-text {
                font-family: 'Manrope', sans-serif !important;
                font-weight: 700 !important;
                font-size: var(--mlpn-font-size, 12px) !important;
                color: white;
                text-transform: uppercase !important;
                letter-spacing: 0.5px !important;
                pointer-events: none !important;

                position: absolute !important;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                width: 100% !important;
                height: auto;
                max-height: 20px;
                overflow: hidden;

                display: flex !important;
                align-items: center;
                justify-content: center;

                text-align: center !important;
                line-height: 1 !important;
                margin: 0 !important;
                padding: 0 !important;
                z-index: 10 !important;
            }

            .honor-text-svg {
                display: none !important;
            }

            .outline-black {
                text-shadow:
                    -1px -1px 0 #000,
                     1px -1px 0 #000,
                    -1px  1px 0 #000,
                     1px  1px 0 #000 !important;
            }

            .outline-blue {
                text-shadow:
                    -1px -1px 0 #310AF5,
                     1px -1px 0 #310AF5,
                    -1px  1px 0 #310AF5,
                     1px  1px 0 #310AF5 !important;
            }

            .outline-red {
                text-shadow:
                    -1px -1px 0 #ff4d4d,
                     1px -1px 0 #ff4d4d,
                    -1px  1px 0 #ff4d4d,
                     1px  1px 0 #ff4d4d !important;
            }

            .outline-green {
                text-shadow:
                    -1px -1px 0 #3B9932,
                     1px -1px 0 #3B9932,
                    -1px  1px 0 #3B9932,
                     1px  1px 0 #3B9932 !important;
            }

            .outline-orange {
                text-shadow:
                    -1px -1px 0 #ff9c40,
                     1px -1px 0 #ff9c40,
                    -1px  1px 0 #ff9c40,
                     1px  1px 0 #ff9c40 !important;
            }

            .outline-purple {
                text-shadow:
                    -1px -1px 0 #c080ff,
                     1px -1px 0 #c080ff,
                    -1px  1px 0 #c080ff,
                     1px  1px 0 #c080ff !important;
            }

            /* Color Dropdown Toggle */
            .mlpn-color-dropdown {
                margin-bottom: 20px;
            }

            .mlpn-dropdown-toggle {
                width: 100%;
                padding: 10px;
                background: #444;
                color: white;
                border: 1px solid #666;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                text-align: left;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .mlpn-dropdown-toggle:hover {
                background: #555;
            }

            .mlpn-dropdown-toggle::after {
                content: '▼';
                font-size: 10px;
                transition: transform 0.3s;
            }

            .mlpn-dropdown-toggle.active::after {
                transform: rotate(180deg);
            }

            .mlpn-dropdown-content {
                display: none;
                margin-top: 10px;
            }

            .mlpn-dropdown-content.active {
                display: block;
            }

            /* Settings Button */
            .mlpn-settings-btn {
                background: #D2691E;
                color: white;
                border: none;
                padding: 8px 16px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 4px;
                margin-top: 10px;
                transition: background 0.3s ease;
            }

            .mlpn-settings-btn:hover {
                background: #B8571E;
            }

            /* Modal Overlay */
            .mlpn-modal-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                justify-content: center;
                align-items: center;
            }

            .mlpn-modal-overlay.active {
                display: flex;
            }

            /* Modal Content */
            .mlpn-modal {
                background: #2C3539;
                color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }

            .mlpn-modal h2 {
                margin: 0 0 20px 0;
                font-size: 18px;
                border-bottom: 2px solid #555;
                padding-bottom: 10px;
            }

            .mlpn-modal label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
            }

            .mlpn-modal input[type="number"] {
                width: 100px;
                padding: 6px;
                font-size: 14px;
                margin-bottom: 15px;
            }

            /* Color Grid */
            .mlpn-color-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, 20px);
                gap: 4px;
                margin: 15px 0;
                max-height: 300px;
                overflow-y: auto;
            }

            .mlpn-color-square {
                width: 20px;
                height: 20px;
                border: 2px solid #555;
                cursor: pointer;
                transition: transform 0.2s;
            }

            .mlpn-color-square:hover {
                transform: scale(1.2);
                border-color: white;
            }

            .mlpn-color-square.selected {
                border: 3px solid white;
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
            }

            .mlpn-color-buttons {
                margin: 15px 0;
            }

            .mlpn-color-buttons button {
                margin-right: 10px;
                padding: 6px 12px;
                cursor: pointer;
                background: #444;
                color: white;
                border: 1px solid #666;
                border-radius: 4px;
            }

            .mlpn-color-buttons button:hover {
                background: #555;
            }

            .mlpn-custom-color-input {
                margin-top: 10px;
                display: none;
            }

            .mlpn-custom-color-input.active {
                display: block;
            }

            .mlpn-custom-color-input input {
                margin-left: 10px;
            }

            .mlpn-save-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                border-radius: 4px;
                margin-top: 20px;
                width: 100%;
            }

            .mlpn-save-btn:hover {
                background: #45a049;
            }
        `;
        document.head.appendChild(style);

        // Determine text color and outline style based on role and custom colors
        function getColorStyles(wrap, playerId = null) {
            const settings = getSettings();

            let customTextColor = null;
            let customOutlineColor = null;

            if (playerId) {
                // Check if this is the current user
                if (settings.currentUserId && playerId === settings.currentUserId) {
                    customTextColor = settings.myTextColor;
                    customOutlineColor = settings.myColor;
                } else {
                    if (settings.playerTextColors[playerId]) {
                        customTextColor = settings.playerTextColors[playerId];
                    }
                    if (settings.playerColors[playerId]) {
                        customOutlineColor = settings.playerColors[playerId];
                    }
                }
            }

            // Determine outline
            let outlineClassName = 'outline-black';
            let customOutlineShadow = null;

            if (customOutlineColor && customOutlineColor !== '#ffffff') {
                // Custom outline color
                customOutlineShadow = `
                    -1px -1px 0 ${customOutlineColor},
                     1px -1px 0 ${customOutlineColor},
                    -1px  1px 0 ${customOutlineColor},
                     1px  1px 0 ${customOutlineColor}
                `;
                outlineClassName = '';
            } else {
                // Role-based outline
                if (wrap.classList.contains('admin')) outlineClassName = 'outline-red';
                else if (wrap.classList.contains('officer')) outlineClassName = 'outline-green';
                else if (wrap.classList.contains('moderator')) outlineClassName = 'outline-orange';
                else if (wrap.classList.contains('helper')) outlineClassName = 'outline-purple';
                else if (wrap.classList.contains('blue')) outlineClassName = 'outline-blue';
            }

            // Determine text color (default to white)
            const textColor = customTextColor || '#ffffff';

            return {
                textColor,
                outlineClassName,
                customOutlineShadow
            };
        }

        // Extract player ID from honor bar link
        function extractPlayerIdFromHonorBar(wrap) {
            const link = wrap.closest('a[href*="profiles.php?XID="]');
            if (link) {
                const match = link.href.match(/XID=(\d+)/);
                if (match) return match[1];
            }
            // Fallback to profile page ID if no link found (e.g., on profile pages)
            return getProfileId();
        }

        // Calculate optimal font size that fits within honor bar
        function calculateFontSize(text, honorBarWidth, desiredSize) {
            // Create temporary element to measure text
            const temp = document.createElement('div');
            temp.style.cssText = `
                position: absolute;
                visibility: hidden;
                font-family: 'Manrope', sans-serif;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                white-space: nowrap;
            `;
            temp.textContent = text;
            document.body.appendChild(temp);

            let fontSize = desiredSize;
            const maxHeight = 18; // Maximum height to fit in 20px honor bar with some padding

            // Test if desired size fits
            temp.style.fontSize = fontSize + 'px';
            let textWidth = temp.offsetWidth;
            let textHeight = temp.offsetHeight;

            // Reduce font size if text is too wide or too tall
            while ((textWidth > honorBarWidth - 10 || textHeight > maxHeight) && fontSize > 6) {
                fontSize--;
                temp.style.fontSize = fontSize + 'px';
                textWidth = temp.offsetWidth;
                textHeight = temp.offsetHeight;
            }

            document.body.removeChild(temp);
            return fontSize;
        }

        // Replace honor bar name with custom text
        function replaceHonorText() {
            const settings = getSettings();

            document.querySelectorAll('.honor-text-wrap').forEach(wrap => {
                const sprite = wrap.querySelector('.honor-text-svg');
                const existing = wrap.querySelector('.custom-honor-text');

                if (sprite) sprite.style.display = 'none';
                if (existing) return;

                const text = wrap.getAttribute('data-title') || wrap.getAttribute('aria-label') || wrap.innerText || '';
                const cleaned = text.trim().toUpperCase();
                if (!cleaned) return;

                // Determine honor bar width
                const img = wrap.querySelector('img');
                const honorBarWidth = img ? (wrap.classList.contains('big') ? 200 : 100) : 200;

                // Get player ID
                const playerId = extractPlayerIdFromHonorBar(wrap);

                // Calculate optimal font size
                const desiredSize = settings.fontSize;
                const optimalSize = calculateFontSize(cleaned, honorBarWidth, desiredSize);

                // Get color styles (text and outline)
                const colorStyles = getColorStyles(wrap, playerId);

                // Create custom text div
                const div = document.createElement('div');
                div.className = `custom-honor-text ${colorStyles.outlineClassName}`;
                div.textContent = cleaned;
                div.style.fontSize = optimalSize + 'px';
                div.style.color = colorStyles.textColor;

                if (colorStyles.customOutlineShadow) {
                    div.style.textShadow = colorStyles.customOutlineShadow;
                }

                wrap.appendChild(div);
            });
        }

        // Update font size CSS variable
        function updateFontSizeVariable(size) {
            document.documentElement.style.setProperty('--mlpn-font-size', size + 'px');
        }

        // Extract profile ID from page
        function getProfileId() {
            // Try URL parameter first
            const urlMatch = window.location.href.match(/XID=(\d+)/);
            if (urlMatch) return urlMatch[1];

            // Try h4 element
            const h4 = document.querySelector('#skip-to-content');
            if (h4) {
                const textMatch = h4.textContent.match(/\[(\d+)\]/);
                if (textMatch) return textMatch[1];
            }

            return null;
        }

        // Helper function to create a color dropdown section
        function createColorDropdown(id, label, defaultColor, defaultLabel = 'Default (White)') {
            let selectedColor = defaultColor;

            const html = `
                <div class="mlpn-color-dropdown">
                    <label>${label}:</label>
                    <button class="mlpn-dropdown-toggle" data-dropdown="${id}">
                        <span class="mlpn-dropdown-label">Currently: ${defaultLabel}</span>
                    </button>
                    <div class="mlpn-dropdown-content" id="${id}">
                        <div class="mlpn-color-grid" data-grid="${id}"></div>
                        <div class="mlpn-color-buttons">
                            <button data-custom="${id}">Custom</button>
                            <button data-default="${id}">Default</button>
                        </div>
                        <div class="mlpn-custom-color-input" data-custom-container="${id}">
                            <label>Custom Color:</label>
                            <input type="color" data-picker="${id}" value="${defaultColor}">
                            <input type="text" data-text="${id}" value="${defaultColor}" placeholder="#ffffff" style="width: 100px;">
                        </div>
                    </div>
                </div>
            `;

            return { html, selectedColor };
        }

        // Create settings modal
        function createSettingsModal() {
            const settings = getSettings();
            const profileId = getProfileId();
            const currentUserId = settings.currentUserId;
            const isOwnProfile = profileId && currentUserId && profileId === currentUserId;

            // Determine initial colors
            let textColorDefault, outlineColorDefault, textColorLabel, outlineColorLabel;

            if (isOwnProfile) {
                textColorDefault = settings.myTextColor || '#ffffff';
                outlineColorDefault = settings.myColor || '#ffffff';
                textColorLabel = textColorDefault === '#ffffff' ? 'Default (White)' : textColorDefault;
                outlineColorLabel = outlineColorDefault === '#ffffff' ? 'Default (Role-based)' : outlineColorDefault;
            } else {
                textColorDefault = settings.playerTextColors[profileId] || '#ffffff';
                outlineColorDefault = settings.playerColors[profileId] || '#ffffff';
                textColorLabel = textColorDefault === '#ffffff' ? 'Default (White)' : textColorDefault;
                outlineColorLabel = outlineColorDefault === '#ffffff' ? 'Default (Role-based)' : outlineColorDefault;
            }

            const textDropdown = createColorDropdown('text-color', isOwnProfile ? 'My Text Color' : "Player's Text Color", textColorDefault, textColorLabel);
            const outlineDropdown = createColorDropdown('outline-color', isOwnProfile ? 'My Outline Color' : "Player's Outline Color", outlineColorDefault, outlineColorLabel);

            // Track selected colors
            let selectedTextColor = textColorDefault;
            let selectedOutlineColor = outlineColorDefault;

            // Create overlay
            const overlay = document.createElement('div');
            overlay.className = 'mlpn-modal-overlay';
            overlay.innerHTML = `
                <div class="mlpn-modal">
                    <h2>More Legible Player Names Settings</h2>
                    ${isOwnProfile ? `
                        <div>
                            <label>Font Size (px):</label>
                            <input type="number" id="mlpn-font-size-input" min="6" max="30" value="${settings.fontSize}">
                            <small style="display: block; margin-bottom: 15px; color: #ccc;">Applies to all honor bars globally</small>
                        </div>
                    ` : ''}
                    ${textDropdown.html}
                    ${outlineDropdown.html}
                    <button class="mlpn-save-btn" id="mlpn-save-btn">Save Changes and Exit</button>
                </div>
            `;

            document.body.appendChild(overlay);

            // Setup dropdowns
            function setupDropdown(dropdownId, onColorSelect, defaultValue) {
                const toggle = overlay.querySelector(`[data-dropdown="${dropdownId}"]`);
                const content = overlay.querySelector(`#${dropdownId}`);
                const grid = overlay.querySelector(`[data-grid="${dropdownId}"]`);
                const customBtn = overlay.querySelector(`[data-custom="${dropdownId}"]`);
                const defaultBtn = overlay.querySelector(`[data-default="${dropdownId}"]`);
                const customContainer = overlay.querySelector(`[data-custom-container="${dropdownId}"]`);
                const colorPicker = overlay.querySelector(`[data-picker="${dropdownId}"]`);
                const colorText = overlay.querySelector(`[data-text="${dropdownId}"]`);
                const label = toggle.querySelector('.mlpn-dropdown-label');

                // Toggle dropdown
                toggle.addEventListener('click', () => {
                    const isActive = content.classList.contains('active');
                    // Close all dropdowns
                    overlay.querySelectorAll('.mlpn-dropdown-content').forEach(d => d.classList.remove('active'));
                    overlay.querySelectorAll('.mlpn-dropdown-toggle').forEach(t => t.classList.remove('active'));
                    // Toggle this one
                    if (!isActive) {
                        content.classList.add('active');
                        toggle.classList.add('active');
                    }
                });

                // Populate color grid with sorted colors
                SORTED_CSS_COLORS.forEach(colorName => {
                    const square = document.createElement('div');
                    square.className = 'mlpn-color-square';
                    square.style.background = colorName;
                    square.title = colorName;
                    square.dataset.color = colorName;

                    square.addEventListener('click', () => {
                        grid.querySelectorAll('.mlpn-color-square').forEach(s => s.classList.remove('selected'));
                        square.classList.add('selected');
                        onColorSelect(colorName);
                        label.textContent = `Currently: ${colorName}`;
                        customContainer.classList.remove('active');
                    });

                    grid.appendChild(square);
                });

                // Custom button
                customBtn.addEventListener('click', () => {
                    customContainer.classList.add('active');
                    grid.querySelectorAll('.mlpn-color-square').forEach(s => s.classList.remove('selected'));
                });

                // Default button
                defaultBtn.addEventListener('click', () => {
                    onColorSelect(defaultValue);
                    label.textContent = `Currently: ${defaultValue === '#ffffff' ? 'Default' : defaultValue}`;
                    grid.querySelectorAll('.mlpn-color-square').forEach(s => s.classList.remove('selected'));
                    customContainer.classList.remove('active');
                });

                // Sync color picker and text input
                colorPicker.addEventListener('input', (e) => {
                    colorText.value = e.target.value;
                    onColorSelect(e.target.value);
                    label.textContent = `Currently: ${e.target.value}`;
                });

                colorText.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(value)) {
                        colorPicker.value = value;
                        onColorSelect(value);
                        label.textContent = `Currently: ${value}`;
                    }
                });
            }

            setupDropdown('text-color', (color) => { selectedTextColor = color; }, '#ffffff');
            setupDropdown('outline-color', (color) => { selectedOutlineColor = color; }, '#ffffff');

            // Save button
            overlay.querySelector('#mlpn-save-btn').addEventListener('click', () => {
                const newSettings = getSettings();

                if (isOwnProfile) {
                    const fontSize = parseInt(overlay.querySelector('#mlpn-font-size-input').value);
                    newSettings.fontSize = fontSize;
                    newSettings.myTextColor = selectedTextColor;
                    newSettings.myColor = selectedOutlineColor;
                } else {
                    newSettings.playerTextColors[profileId] = selectedTextColor;
                    newSettings.playerColors[profileId] = selectedOutlineColor;
                }

                saveSettings(newSettings);
                overlay.classList.remove('active');

                // Refresh honor bars
                document.querySelectorAll('.custom-honor-text').forEach(el => el.remove());
                replaceHonorText();
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });

            return overlay;
        }

        // Add settings button to profile page
        function addSettingsButton() {
            if (!window.location.href.includes('/profiles.php')) return;

            const delimiter = document.querySelector('.page-head-delimiter');
            if (!delimiter || document.querySelector('.mlpn-settings-btn')) return;

            const button = document.createElement('button');
            button.className = 'mlpn-settings-btn';
            button.textContent = 'More Legible Player Names';

            button.addEventListener('click', () => {
                let modal = document.querySelector('.mlpn-modal-overlay');
                if (!modal) {
                    modal = createSettingsModal();
                }
                modal.classList.add('active');
            });

            delimiter.parentNode.insertBefore(button, delimiter.nextSibling);
        }

        // Initialize
        function init() {
            // Extract user ID
            extractUserId();

            // Apply saved font size
            const settings = getSettings();
            updateFontSizeVariable(settings.fontSize);

            // Replace honor text
            replaceHonorText();

            // Add settings button on profile pages
            addSettingsButton();

            // Watch for dynamic changes
            const observer = new MutationObserver(() => {
                replaceHonorText();
                addSettingsButton();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // Run on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
