// ==UserScript==
// @name         Torn Attack Buttons
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Eheheh
// @author       Apollyon
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license MIT
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/550553/Torn%20Attack%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/550553/Torn%20Attack%20Buttons.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // --- User-defined Defaults ---
    const DEFAULT_OUTCOME = "hosp"; // Default outcome: leave, mug, or hosp
    const DEFAULT_WEAPON = "primary"; // Default weapon: primary, secondary, melee
    const DEFAULT_USE_TEMP = false; // Default temp weapon state

    // --- Script-wide Settings ---
    let settings = {
        outcome: DEFAULT_OUTCOME,
        weapon: DEFAULT_WEAPON,
        useTemp: DEFAULT_USE_TEMP
    };

    // --- Original Script Variables ---
    const buttonRefreshRate = 50; // How quickly to check for button changes (ms)
    var objForStorage = {};
    const buttonSelector = 'div[class^="dialogButtons"]';
    const playerArea = 'div[class^="playerArea"]';
    const settingsPanelTarget = 'div[class^="titleContainer"]'; // <-- Target for settings panel
    const storage = {
        selectedOutcome: "",
        button: 0,
        selectedIndex: 0
    };
    const movedButtons = new Set();

    // --- Observers ---
    const buttonObserver = new MutationObserver((mutations) => {
        checkAndMoveButtons();
    });
    const documentObserver = new MutationObserver((mutations) => {
        if (document.querySelectorAll(buttonSelector).length > 0) {
            checkAndMoveButtons();
        }
        // Also check if settings panel needs to be re-added
        if (document.querySelector(settingsPanelTarget) && !document.getElementById('easyFightSettings')) {
             waitForKeyElements(settingsPanelTarget, (element) => {
                 if (!document.getElementById('easyFightSettings')) {
                     createSettingsPanel(element);
                 }
             });
        }
    });

    // --- Core Functions ---

    // Load settings from storage
    async function loadSettings() {
        settings.outcome = await GM_getValue('ef_outcome', DEFAULT_OUTCOME);
        settings.weapon = await GM_getValue('ef_weapon', DEFAULT_WEAPON);
        settings.useTemp = await GM_getValue('ef_useTemp', DEFAULT_USE_TEMP);
        updateStorageFromSettings(); // Apply loaded settings
    }

    // Update script logic when settings change
    function updateStorageFromSettings() {
        storage.selectedOutcome = settings.outcome;
        storage.selectedIndex = { leave: 0, mug: 1, hosp: 2 }[settings.outcome];

        calculateStyle(settings.weapon, settings.useTemp);
        checkAndMoveButtons();
    }

    // Function to check and move buttons if needed
    function checkAndMoveButtons() {
        const optionsDialogBox = document.querySelector(buttonSelector);
        if (!optionsDialogBox) return;

        const optionsBox = optionsDialogBox.children;

        for (const option of optionsBox) {
            const text = option.innerText.toLowerCase();
            const index = [...option.parentNode.children].indexOf(option);

            if ((text.includes("fight") || storage.selectedIndex == index) &&
                (!option.classList.contains("btn-move") || !isButtonCorrectlyPositioned(option))) {

                option.classList.remove("btn-move");
                option.classList.add("btn-move");
                movedButtons.add(option);

                if (text.includes("fight")) {
                    calculateStyle(settings.weapon, settings.useTemp);
                } else if (storage.selectedIndex == index) {
                    calculateStyle(settings.weapon, settings.useTemp);
                    option.removeEventListener("click", closeTabAfterClick);
                    option.addEventListener("click", closeTabAfterClick);
                }
            }
        }
    }

    // Helper function to close tab
    function closeTabAfterClick() {
        setTimeout(() => window.close(), 250);
    }

    // Check if button is correctly positioned
    function isButtonCorrectlyPositioned(button) {
        const style = window.getComputedStyle(button);
        return style.position === 'absolute' &&
            style.zIndex === '1000' &&
            parseInt(style.height) === 45 &&
            parseInt(style.width) === 120;
    }

    // Function to wait for an element to appear
    function waitForKeyElements(element, callbackFunc) {
        objForStorage[element] = setInterval(function () {
            let node = document.querySelector(element);
            if (node) {
                clearInterval(objForStorage[element]);
                callbackFunc(node);
            }
        }, buttonRefreshRate);
    }

    // Function to apply CSS styles for buttons
    function restyleCSS(topMobile, topTablet, topDesktop) {
        const size = window.innerWidth;
        const mobileSize = 600;
        const tabletSize = 1000;
        const leftMobile = "-100px";
        const leftTablet = "-140px";
        const leftDesktop = "-150px";
        let myTop = "";
        let myLeft = "";
        let modelWrapWidth = "240px";

        if (size <= mobileSize) {
            myTop = topMobile;
            myLeft = leftMobile;
        } else if (size <= tabletSize) {
            myTop = topTablet;
            myLeft = leftTablet;
        } else {
            myTop = topDesktop;
            myLeft = leftDesktop;
            modelWrapWidth = "323px";
        }

        GM_addStyle(`
            div[class^="dialogButtons"] > button[class$="btn-move"] {
                position: absolute !important;
                left: ${myLeft} !important;
                top: ${myTop} !important;
                height: 45px !important;
                width: 120px !important;
                z-index: 1000 !important;
            }
            .playerWindow___aDeDI { overflow: visible !important; }
            .modelWrap___j3kfA {
                visibility: visible !important;
                position: relative;
                width: ${modelWrapWidth} !important;
                height: 423px !important;
                overflow: hidden !important;
            }
            .modelLayers___HFVIQ { position: relative; }
            .model___HOHCU { position: relative; }
            .armoursWrap___xqZGV { position: relative; }
            .armourContainer___zL52C { position: relative; }
        `);
    }

    // Determine button positioning
    function calculateStyle(defaultWeapon, useTemp = false) {
        let topMobile = "";
        let topTablet = "";
        let topDesktop = "";

        if (useTemp) {
            topMobile = `192.5px`;
            topTablet = `297.5px`;
            topDesktop = `330.5px`;
        } else {
            switch (defaultWeapon) {
                case "primary":
                    topMobile = `10px`;
                    topTablet = `10px`;
                    topDesktop = `29px`;
                    break;
                case "secondary":
                    topMobile = `75px`;
                    topTablet = `110px`;
                    topDesktop = `129px`;
                    break;
                case "melee":
                    topMobile = `140px`;
                    topTablet = `210px`;
                    topDesktop = `229px`;
                    break;
            }
        }
        restyleCSS(topMobile, topTablet, topDesktop);
    }

    // --- NEW: Settings Panel (In-Bar) ---

    function createSettingsPanel(targetElement) {
        const panel = document.createElement('div');
        panel.id = "easyFightSettings";
        targetElement.style.position = "relative";

        // Compact, horizontal layout
        panel.innerHTML = `
            <div class="ef-group">
                <button data-setting="weapon" data-value="primary" title="Set Weapon: Primary">Pri</button>
                <button data-setting="weapon" data-value="secondary" title="Set Weapon: Secondary">Sec</button>
                <button data-setting="weapon" data-value="melee" title="Set Weapon: Melee">Mel</button>
                <button data-setting="useTemp" data-value="toggle" title="Toggle Temporary Weapon">Temp</button>
            </div>
            <div class="ef-group">
                <button data-setting="outcome" data-value="leave" title="Set Outcome: Leave">Leave</button>
                <button data-setting="outcome" data-value="hosp" title="Set Outcome: Hospitalize">Hosp</button>
                <button data-setting="outcome" data-value="mug" title="Set Outcome: Mug">Mug</button>
            </div>
        `;

        // Find the inner div that contains the timer
        const timerContainer = targetElement.querySelector('div[style*="gap: 15px"]');
        if (timerContainer) {
             // Prepend our panel inside this container, so it appears before the timer
             timerContainer.prepend(panel);
        } else {
             // Fallback: just append to the main target
             targetElement.appendChild(panel);
        }


        // Add styles for the panel
GM_addStyle(`
    #easyFightSettings {
        position: absolute;
        left: 170px;
        top: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
        font-size: 12px;
        color: #eee;
        z-index: 9999;
    }

    .ef-group {
        display: flex;
        align-items: center;
        gap: 4px;
        background: transparent;
        padding: 4px 6px;
        border-radius: 6px;
        border: none;
    }

    /* Modern gray button style (from script 2) */
    #easyFightSettings button {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        padding: 4px 10px;
        margin: 1px 3px;
        font-family: inherit;
        font-size: 12px;
        border-radius: 6px;
        border: none;
        background: #6E6D70;
        box-shadow:
            0px 0.5px 1px rgba(0, 0, 0, 0.1),
            inset 0px 0.5px 0.5px rgba(255, 255, 255, 0.5),
            0px 0px 0px 0.5px rgba(0, 0, 0, 0.12);
        color: #DFDEDF;
        cursor: pointer;
        user-select: none;
        font-weight: bold;
    }

    #easyFightSettings button:hover {
        background: #5a595b;
    }

    #easyFightSettings button:focus {
        outline: none;
    }

    /* ✅ Unified green glow for all selected buttons */
    #easyFightSettings button.ef-active,
    #easyFightSettings button.ef-active-toggle {
        box-shadow: 0px 0px 6px 1px rgba(0, 255, 0, 0.8);
        background: #5f5f5f;
    }
`);


        // Add click event listeners
        panel.addEventListener('click', async (e) => { // <-- Made async
            if (e.target.tagName !== 'BUTTON') return;

            const setting = e.target.dataset.setting;
            const value = e.target.dataset.value;

            if (setting === 'outcome') {
                settings.outcome = value;
                await GM_setValue('ef_outcome', value); // <-- Added await
                location.reload(); // <-- Added page refresh
                return; // Stop execution since page is reloading
            } else if (setting === 'weapon') {
                settings.weapon = value;
                await GM_setValue('ef_weapon', value);
                settings.useTemp = false; // Turn off temp if a weapon is clicked
                await GM_setValue('ef_useTemp', false);
            } else if (setting === 'useTemp') {
                settings.useTemp = !settings.useTemp; // Toggle
                await GM_setValue('ef_useTemp', settings.useTemp);
            }

            updateActiveButtons();
            updateStorageFromSettings(); // Apply changes immediately
        });

        updateActiveButtons(); // Set initial active state
    }

    // Update button highlighting in the settings panel
    function updateActiveButtons() {
        const panel = document.getElementById('easyFightSettings');
        if (!panel) return;

        // Clear all active
        panel.querySelectorAll('button.ef-active').forEach(b => b.classList.remove('ef-active'));
        panel.querySelectorAll('button.ef-active-toggle').forEach(b => b.classList.remove('ef-active-toggle'));

        // Set outcome
        const outcomeBtn = panel.querySelector(`button[data-setting="outcome"][data-value="${settings.outcome}"]`);
        if (outcomeBtn) outcomeBtn.classList.add('ef-active');

        // Set temp button
        const tempBtn = panel.querySelector(`button[data-setting="useTemp"]`);
        if (tempBtn && settings.useTemp) {
            tempBtn.classList.add('ef-active-toggle');
        }

        // Set weapon (only if temp is not active)
        if (!settings.useTemp) {
            const weaponBtn = panel.querySelector(`button[data-setting="weapon"][data-value="${settings.weapon}"]`);
            if (weaponBtn) weaponBtn.classList.add('ef-active');
        }
    }

    // --- Start the script ---
    async function initScript() {
        // Load settings from storage first
        await loadSettings();

        // Wait for the title container to exist, then create the settings panel inside it
        waitForKeyElements(settingsPanelTarget, (element) => {
             // Check if panel already exists, to avoid duplicates on re-renders
            if (!document.getElementById('easyFightSettings')) {
                createSettingsPanel(element);
            }
        });

        // Apply initial styles
        calculateStyle(settings.weapon, settings.useTemp);

        // Set up continuous checking for button changes
        setInterval(checkAndMoveButtons, buttonRefreshRate);

        // Set up observers
        if (document.body) {
            documentObserver.observe(document.body, {
                attributes: true,
                childList: true,
                subtree: true
            });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                 documentObserver.observe(document.body, {
                    attributes: true,
                    childList: true,
                    subtree: true
                 });
            });
        }

        // Wait for specific elements and observe them
        waitForKeyElements(playerArea, (element) => {
            buttonObserver.observe(element, {
                attributes: true,
                childList: true,
                subtree: true
            });
        });

        // Wait for button container and move buttons
        waitForKeyElements(buttonSelector, (element) => {
            buttonObserver.observe(element, {
                attributes: true,
                childList: true,
                subtree: true
            });
            checkAndMoveButtons();
        });
    }

    // Handle window resize
    window.addEventListener("resize", checkAndMoveButtons);

    // Initialize the script
    initScript();

})();