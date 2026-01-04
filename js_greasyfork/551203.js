// ==UserScript==
// @name         Backoffice Suspend User Reason Helper
// @namespace    http://tampermonkey.net/
// @version      3.03
// @description  Enhances the Howly admin suspend user page by adding a glass-style dropdown with predefined suspension reasons, a tenant filter toggle with a custom dropdown, visual tenant branding with color highlights, automatic light/dark theme support, and persistent filter state
// @author       Artur Pozhytko
// @match        https://admin.howly.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/551203/Backoffice%20Suspend%20User%20Reason%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/551203/Backoffice%20Suspend%20User%20Reason%20Helper.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // --- Configuration ---
    const reasons = [
        "User didn't know about our subscription",
        "User forgot to cancel our subscription",
        "No specific reason",
        "User doesn't want our service",
        "Bad service quality",
        "Our mistake",
        "User mistook us for someone else",
        "Too expensive",
        "Issue we don't cover",
        "Very angry customer",
        "One time use",
        "Security & privacy reasons",
        "Change details",
        "Other reason"
    ];
    const tenantMap = {
        "pdf_aid": "PDFAid",
        "pdf_house": "PDF House",
        "howly_docs": "Howly Docs"
    };
    const tenantColors = {
        "pdf_aid": "#FF5252",   // Neon Red
        "pdf_house": "#7C4DFF", // Neon Purple
        "howly_docs": "#448AFF" // Neon Blue
    };
    const filteredTenants = Object.entries(tenantMap).map(([value, label]) => ({ value, label }));
    // --- Theme Detection ---
    function isLightTheme() {
        try {
            // Check computed background color of body
            const bg = window.getComputedStyle(document.body).backgroundColor;
            const rgb = bg.match(/\d+/g);
            if (!rgb) return false; // Default to dark if undefined

            // Brightness formula
            const brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
            return brightness > 125;
        } catch (e) {
            return false;
        }
    }
    // --- Global Glassmorphism Styles ---
    const globalStyle = document.createElement('style');
    globalStyle.textContent = `
        /* Animation */
        @keyframes glass-pop-in {
            0% { opacity: 0; transform: scale(0.95) translateY(-5px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        /*
           BASE GLASS STYLE (Applied to both, optimized for DARK THEMES)
           User Request: "Not too light, not too dark, just glass"
           Solution: Neutral transparency with blur heavy lifting.
        */
        .MuiPaper-root.MuiMenu-paper, .glass-menu {
            background-color: rgba(255, 255, 255, 0.05) !important; /* Very subtle white tint */
            backdrop-filter: blur(16px) !important; /* Stronger blur for glass effect */
            -webkit-backdrop-filter: blur(16px) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
            border-radius: 16px !important;
            color: #fff !important;

            transform-origin: top center;
            animation: glass-pop-in 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
        /*
           LIGHT THEME OVERRIDE
           User Request: "Make darkening of glass effect" & "Readable text"
           Solution: Darker Black tint to ensure contrast against white page background.
        */
        .glass-menu-light {
            background-color: rgba(5, 5, 10, 0.85) !important; /* Very Dark Glass */
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5) !important;
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
        /* Hover Effects */
        .MuiMenuItem-root:hover, .glass-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.15) !important;
        }

        /* Scrollbar */
        .MuiPaper-root.MuiMenu-paper::-webkit-scrollbar, .glass-menu::-webkit-scrollbar { width: 6px; }
        .MuiPaper-root.MuiMenu-paper::-webkit-scrollbar-track, .glass-menu::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
        }
        .MuiPaper-root.MuiMenu-paper::-webkit-scrollbar-thumb, .glass-menu::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
        }
        .MuiPaper-root.MuiMenu-paper::-webkit-scrollbar-thumb:hover, .glass-menu::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        /* Toggle Styles */
        .tenant-toggle-container {
            display: flex;
            align-items: center;
            margin-left: 10px;
            cursor: pointer;
            user-select: none;
        }
        .tenant-toggle-label {
             margin-right: 8px;
             font-size: 0.875rem;
             color: inherit; /* Will inherit darker text automatically in light mode */
             font-family: "Roboto","Helvetica","Arial",sans-serif;
             font-weight: 500;
             opacity: 0.9;
        }
        /* Fix label visibility in dark mode if inheritance fails */
        @media (prefers-color-scheme: dark) {
            .tenant-toggle-label { color: #e8e6e3; }
        }
        .toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background-color: #b0b0b0;
            border-radius: 20px;
            transition: background-color 0.3s;
        }
        .toggle-switch.active { background-color: #2196f3; }
        .toggle-knob {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background-color: white;
            border-radius: 50%;
            transition: transform 0.3s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .toggle-switch.active .toggle-knob { transform: translateX(20px); }
    `;
    document.head.appendChild(globalStyle);
    // --- Helper: Create Glass Dropdown ---
    function createGlassDropdown(items, onSelect, triggerElement, menuId) {
        let menu = document.getElementById(menuId);

        // Ensure menu exists
        if (!menu) {
            menu = document.createElement('div');
            menu.id = menuId;
            menu.className = 'glass-menu';

            Object.assign(menu.style, {
                display: 'none',
                position: 'absolute',
                zIndex: '10001',
                maxHeight: '300px',
                overflowY: 'auto',
                boxSizing: 'border-box',
                padding: '8px 0',
                minWidth: triggerElement.offsetWidth + 'px'
            });
            items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'glass-menu-item';

                const label = typeof item === 'object' ? item.label : item;
                const value = typeof item === 'object' ? item.value : item;
                itemEl.textContent = label;
                Object.assign(itemEl.style, {
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                    color: 'inherit',
                    transition: 'background-color 0.2s ease',
                    borderRadius: '8px',
                    margin: '0 8px'
                });
                itemEl.addEventListener('click', () => {
                    onSelect(value, label);
                    menu.style.display = 'none';
                });
                menu.appendChild(itemEl);
            });
            document.body.appendChild(menu);

            // Global Close Handler (Only attach once per menu creation)
            document.addEventListener('click', (e) => {
                if (menu.style.display === 'block' && !menu.contains(e.target) && !triggerElement.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });
        }
        // --- Dynamic Theme Check on Every Access ---
        // This ensures if user toggled theme, the next click opens correct style
        if (isLightTheme()) {
            menu.classList.add('glass-menu-light');
        } else {
            menu.classList.remove('glass-menu-light');
        }
        return menu;
    }
    // --- Dynamic Theme Observer ---
    // Watches for class/style changes on Body/HTML to update open menus immediately
    const themeObserver = new MutationObserver(() => {
        const isLight = isLightTheme();
        const menus = document.querySelectorAll('.glass-menu');
        menus.forEach(menu => {
            if (isLight) menu.classList.add('glass-menu-light');
            else menu.classList.remove('glass-menu-light');
        });
    });
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class', 'data-theme'] });
    // --- Feature 1: Reason Helper ---
    function addReasonDropdown(reasonInput) {
        if (document.getElementById('reason-helper-trigger')) return;
        const inputContainer = reasonInput.closest('.MuiInputBase-root');
        if (!inputContainer) return;
        // Trigger Button
        const trigger = document.createElement('div');
        trigger.id = 'reason-helper-trigger';
        trigger.innerHTML = `<svg style="fill: #757575; width: 24px; height: 24px;" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></path></svg>`;
        Object.assign(trigger.style, {
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            cursor: 'pointer', width: '32px', height: '32px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', borderRadius: '50%', zIndex: 10
        });
        inputContainer.appendChild(trigger);

        // Pass trigger as the source element
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();

            const menu = createGlassDropdown(reasons, (value) => {
                // Re-query input to avoid stale reference
                const currentReasonInput = document.querySelector('input#reason');
                if (currentReasonInput) {
                    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeSetter.call(currentReasonInput, value);
                    currentReasonInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, inputContainer, 'reason-helper-menu');

            // Toggle Logic
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
            } else {
                const rect = inputContainer.getBoundingClientRect();
                menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
                menu.style.left = `${rect.left + window.scrollX}px`;
                menu.style.width = `${rect.width}px`;
                menu.style.display = 'block';
                // Reset scroll position to top
                menu.scrollTop = 0;
            }
        });
    }
    // --- Feature 2: Tenant Toggle & Filter ---
    function addTenantToggle() {
        if (document.getElementById('tenant-toggle-container')) return;
        const tenantSelect = document.getElementById('tenant');
        if (!tenantSelect) return;
        const tenantContainer = tenantSelect.closest('.MuiFormControl-root');
        if (!tenantContainer) return;
        const tenantInputContainer = tenantSelect.closest('.MuiInputBase-root');
        if (!tenantInputContainer) return;
        // Insert Toggle
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'tenant-toggle-container';
        toggleContainer.className = 'tenant-toggle-container';
        toggleContainer.style.marginLeft = '0';
        toggleContainer.style.marginRight = '16px';

        toggleContainer.innerHTML = `
            <span class="tenant-toggle-label">Filter</span>
            <div class="toggle-switch">
                <div class="toggle-knob"></div>
            </div>
        `;

        tenantContainer.parentNode.insertBefore(toggleContainer, tenantContainer);
        tenantContainer.parentNode.style.display = 'flex';
        tenantContainer.parentNode.style.alignItems = 'center';
        // Create Shield Overlay (also acts as trigger)
        const overlay = document.createElement('div');
        overlay.id = 'tenant-overlay-shield';
        Object.assign(overlay.style, {
            position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
            zIndex: '100', display: 'none', cursor: 'pointer', backgroundColor: 'transparent'
        });
        tenantInputContainer.style.position = 'relative';
        tenantInputContainer.appendChild(overlay);
        // Load state from LocalStorage
        let filterActive = localStorage.getItem('tenantFilterActive') === 'true';
        // Helper: Reset Visual Styles
        const resetVisualStyles = () => {
            tenantInputContainer.style.backgroundImage = '';
            tenantInputContainer.style.backgroundColor = '';
            tenantInputContainer.style.color = '';
            tenantSelect.style.color = '';
            tenantSelect.style.backgroundColor = '';
            tenantInputContainer.style.borderRadius = '';
            tenantSelect.style.textShadow = '';
            const fieldset = tenantInputContainer.querySelector('fieldset');
            if (fieldset) {
                fieldset.style.display = '';
                fieldset.style.borderColor = '';
                fieldset.style.boxShadow = '';
                fieldset.style.borderWidth = '';
            }
        };
        // Helper: Apply Branding & Visual Label
        const updateVisuals = () => {
            if (!filterActive) return;
            // 1. Get current value from hidden input
            const hiddenInput = tenantContainer.querySelector('input[name="tenant"]');
            const val = hiddenInput ? hiddenInput.value : null;
            // 2. Map Label (pdf_aid -> PDFAid)
            if (val && tenantMap[val]) {
                tenantSelect.textContent = tenantMap[val];
            } else {
                const raw = tenantSelect.textContent.trim();
                if (raw && tenantMap[raw]) {
                    tenantSelect.textContent = tenantMap[raw];
                }
            }
            // 3. Map Color (Neon Border)
            if (val && tenantColors[val]) {
                // Clear full backgrounds if any
                tenantInputContainer.style.backgroundImage = '';
                tenantInputContainer.style.backgroundColor = '';

                // Target the Border (Fieldset)
                const fieldset = tenantInputContainer.querySelector('fieldset');
                if (fieldset) {
                    fieldset.style.display = 'block'; // Ensure visible
                    fieldset.style.borderColor = tenantColors[val];
                    fieldset.style.borderWidth = '2px'; // Make it slightly thicker
                    fieldset.style.boxShadow = `0 0 8px ${tenantColors[val]}, inset 0 0 4px ${tenantColors[val]}33`; // External + Internal Glow
                    fieldset.style.transition = 'all 0.3s ease';
                }
            } else {
                resetVisualStyles();
            }
        };
        const labelObserver = new MutationObserver((mutations) => {
            // Prevent infinite loop: check if the mutation was caused by us or React
            // If we just updated it, we might want to ignore it, but React might revert it.
            // Best approach: Disconnect, update, Reconnect.
            labelObserver.disconnect();
            updateVisuals();
            labelObserver.observe(tenantSelect, { childList: true, characterData: true, subtree: true });
        });
        labelObserver.observe(tenantSelect, { childList: true, characterData: true, subtree: true });
        // Apply initial state
        const switchEl = toggleContainer.querySelector('.toggle-switch');
        if (filterActive) {
            switchEl.classList.add('active');
            overlay.style.display = 'block';
            setTimeout(updateVisuals, 100);
        }
        // Toggle Click Handler
        toggleContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            filterActive = !filterActive;
            localStorage.setItem('tenantFilterActive', filterActive);

            if (filterActive) {
                switchEl.classList.add('active');
                overlay.style.display = 'block';
                updateVisuals();
            } else {
                switchEl.classList.remove('active');
                overlay.style.display = 'none';
                resetVisualStyles();
            }
        });
        // Overlay Click Handler (Toggle Logic)
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            // Create/Get Menu
            // Create/Get Menu
            const menu = createGlassDropdown(filteredTenants, (value, label) => {
                // RE-QUERY DOM ELEMENTS to ensure they are fresh (React might have re-rendered)
                const currentTenantContainer = document.getElementById('tenant')?.closest('.MuiFormControl-root');
                const currentTenantSelect = document.getElementById('tenant');

                if (currentTenantContainer) {
                    const hiddenInput = currentTenantContainer.querySelector('input[name="tenant"]');
                    if (hiddenInput) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(hiddenInput, value);
                        hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
                        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                // Force update immediately on click selection
                if (currentTenantSelect) {
                    requestAnimationFrame(() => {
                        labelObserver.disconnect(); // PAUSE Observer
                        currentTenantSelect.textContent = label;
                        updateVisuals();
                        labelObserver.observe(currentTenantSelect, { childList: true, characterData: true, subtree: true }); // RESUME
                    });

                    setTimeout(() => {
                        labelObserver.disconnect();
                        currentTenantSelect.textContent = label;
                        updateVisuals();
                        labelObserver.observe(currentTenantSelect, { childList: true, characterData: true, subtree: true });
                    }, 50);
                }
            }, tenantInputContainer, 'tenant-filter-menu');
            // Toggle Open/Close
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
            } else {
                const rect = tenantInputContainer.getBoundingClientRect();
                menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
                menu.style.left = `${rect.left + window.scrollX}px`;
                menu.style.width = `${rect.width}px`;
                menu.style.display = 'block';

                // Extra check for theme updates just in case observer missed it
                if (isLightTheme()) menu.classList.add('glass-menu-light');
                else menu.classList.remove('glass-menu-light');
            }
        });
    }
    // --- Observer ---
    const observer = new MutationObserver((mutations) => {
        const reasonInput = document.querySelector('input#reason');
        if (reasonInput) addReasonDropdown(reasonInput);
        const tenantSelect = document.getElementById('tenant');
        if (tenantSelect) addTenantToggle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();