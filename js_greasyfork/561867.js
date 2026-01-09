// ==UserScript==
// @name         Torn Gym Stat Hider
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides specific stats (Strength, Defense, Speed, Dexterity) in the gym based on user selection.
// @author       GNS-C4 [3960752]
// @match        https://www.torn.com/gym.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/561867/Torn%20Gym%20Stat%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/561867/Torn%20Gym%20Stat%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * DEBUG MODE
     * Toggle to true to see console logs for debugging.
     */
    const debug = true;

    /**
     * Logger function for debug mode
     */
    function log(message, ...args) {
        if (debug) {
            console.log(`[Gym Hider] ${message}`, ...args);
        }
    }

    log('Script initialized. version 1.0.0');

    // --- Constants ---
    const STORAGE_KEY = 'torn_gym_stat_hider_prefs';
    const STATS = ['strength', 'defense', 'speed', 'dexterity'];

    // --- State ---
    // Default: nothing hidden (false)
    let userSettings = {
        strength: false,
        defense: false,
        speed: false,
        dexterity: false
    };

    // --- Core Logic ---

    /**
     * Load settings from GM storage
     */
    function loadSettings() {
        const stored = GM_getValue(STORAGE_KEY, null);
        if (stored) {
            userSettings = JSON.parse(stored);
            log('Settings loaded from storage:', userSettings);
        } else {
            log('No settings found, using defaults:', userSettings);
        }
    }

    /**
     * Save settings to GM storage
     */
    function saveSettings() {
        GM_setValue(STORAGE_KEY, JSON.stringify(userSettings));
        log('Settings saved:', userSettings);
        applyVisibility();
    }

    /**
     * Apply CSS rules based on settings
     */
    function applyVisibility() {
        log('Applying visibility rules...');
        let css = '';

        STATS.forEach(stat => {
            if (userSettings[stat]) {
                // We use [class*="statName"] to match partial class names (ignoring random hashes)
                // We allow capitalization variations just in case, though usually lowercase in class
                css += `ul[class*="properties"] > li[class*="${stat}"] { display: none !important; }\n`;
                log(`Hiding stat: ${stat}`);
            }
        });

        // Add or Update the style element
        const styleId = 'gns-gym-hider-style';
        let styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
            log('Created new style element.');
        }

        styleEl.textContent = css;
        log('CSS updated.');
    }

    // --- UI Creation ---

    /**
     * Creates and opens the settings modal
     */
    function openSettingsModal() {
        log('Opening settings modal.');

        // Check if modal exists
        if (document.getElementById('gns-gym-modal')) return;

        // Create Modal Overlay
        const overlay = document.createElement('div');
        overlay.id = 'gns-gym-modal';
        overlay.style.cssText = `
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        // Create Modal Content
        const content = document.createElement('div');
        content.style.cssText = `
            background: #333;
            color: #fff;
            padding: 20px;
            border-radius: 8px;
            width: 300px;
            border: 1px solid #555;
            font-family: Arial, sans-serif;
        `;

        const title = document.createElement('h3');
        title.innerText = 'Filter Gym Stats';
        title.style.borderBottom = '1px solid #555';
        title.style.paddingBottom = '10px';
        title.style.marginTop = '0';
        content.appendChild(title);

        const desc = document.createElement('p');
        desc.innerText = 'Select stats to HIDE:';
        desc.style.fontSize = '12px';
        desc.style.color = '#ccc';
        content.appendChild(desc);

        // Checkboxes
        STATS.forEach(stat => {
            const row = document.createElement('div');
            row.style.marginBottom = '8px';
            row.style.display = 'flex';
            row.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `gns-hide-${stat}`;
            checkbox.checked = userSettings[stat];
            checkbox.style.marginRight = '10px';

            const label = document.createElement('label');
            label.innerText = stat.charAt(0).toUpperCase() + stat.slice(1);
            label.setAttribute('for', `gns-hide-${stat}`);

            // Event Listener for toggling
            checkbox.addEventListener('change', (e) => {
                userSettings[stat] = e.target.checked;
                log(`Changed ${stat} to ${e.target.checked}`);
            });

            row.appendChild(checkbox);
            row.appendChild(label);
            content.appendChild(row);
        });

        // Button Container
        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '20px';
        btnContainer.style.textAlign = 'right';

        // Save/Close Button
        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Save & Close';
        closeBtn.style.cssText = `
            padding: 8px 16px;
            background: #66c72a;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.onclick = () => {
            saveSettings();
            document.body.removeChild(overlay);
        };

        btnContainer.appendChild(closeBtn);
        content.appendChild(btnContainer);
        overlay.appendChild(content);

        document.body.appendChild(overlay);
    }

    /**
     * Injects a button into the Gym UI to access settings
     */
    function injectUIButton() {
        // We look for a stable element near the top of the gym content.
        // Based on the HTML provided: <div class="message___nOEfF"> contains the "What would you like to train today?" text.
        // We can append a small link there.
        
        // Target specifically the message wrapper or the gym content wrapper
        const target = document.querySelector('[class*="messageWrapper"]');
        
        if (target && !document.getElementById('gns-filter-btn')) {
            log('Found target for UI button.');
            
            const btn = document.createElement('span');
            btn.id = 'gns-filter-btn';
            btn.innerText = ' [Filter Stats]';
            btn.style.cssText = `
                cursor: pointer;
                color: #999;
                font-size: 12px;
                margin-left: 10px;
                font-weight: bold;
            `;
            
            btn.onmouseover = () => { btn.style.color = '#333'; };
            btn.onmouseout = () => { btn.style.color = '#999'; };
            
            btn.onclick = openSettingsModal;
            
            target.appendChild(btn);
            log('UI Button injected.');
        } else {
            if(!target) log('Target for UI button not found yet.');
        }
    }

    // --- Initialization ---

    function init() {
        log('Starting initialization...');
        loadSettings();
        applyVisibility();

        // Register Menu Command (Tampermonkey menu)
        GM_registerMenuCommand("Filter Gym Stats", openSettingsModal);

        // Observer to handle dynamic loading of the gym page
        const observer = new MutationObserver((mutations) => {
            // Light check to see if we need to inject the button
            if (!document.getElementById('gns-filter-btn')) {
                injectUIButton();
            }
        });

        const root = document.getElementById('gymroot') || document.body;
        
        if (root) {
            observer.observe(root, {
                childList: true,
                subtree: true
            });
            log('Observer attached.');
        } else {
            log('Error: Could not find root element to observe.');
        }
        
        // Try immediate injection
        injectUIButton();
    }

    // Run Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();