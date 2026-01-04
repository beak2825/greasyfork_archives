// ==UserScript==
// @name          Robux Changer 2 - Advanced
// @namespace     http://tampermonkey.net/
// @version       3.8
// @description   In addition to Robux Changer 1
// @author        CSI JML
// @match         https://www.roblox.com/transactions*
// @grant         GM_addStyle
 // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559972/Robux%20Changer%202%20-%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/559972/Robux%20Changer%202%20-%20Advanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SAVE_KEY = 'RobuxChanger2_Save';
    const AUTO_APPLY_INTERVAL_MS = 10; // Apply saved values every 3 seconds
    let guiPanel = null;
    let trackedElements = [];
    let scriptSetupComplete = false;

    // --- Utility Functions (Kept as is) ---

    function extractNumberString(text) {
        if (!text) return null;
        const m = text.match(/(\d{1,3}(?:[,\s]\d{3})*(?:\.\d+)?)/);
        return m ? m[1] : null;
    }

    function parseNumber(numStr) {
        if (!numStr) return null;
        const n = Number(numStr.replace(/,/g, '').replace(/\s/g, ''));
        return Number.isFinite(n) ? n : null;
    }

    function getNumberFromElement(el) {
        if (!el) return null;
        const numStr = extractNumberString(el.textContent);
        if (numStr) return parseNumber(numStr);
        return null;
    }

    function updatePageValue(targetEl, newValue) {
        if (!targetEl || !Number.isFinite(newValue)) return;
        // Format to a whole number with commas
        const formattedValue = Math.round(newValue).toLocaleString('en-US');
        const spans = Array.from(targetEl.querySelectorAll('span'));
        let updated = false;

        // Try to update the last span with a number (common structure for Robux)
        for (let i = spans.length - 1; i >= 0; i--) {
            if (/\d/.test(spans[i].textContent)) {
                spans[i].textContent = formattedValue;
                updated = true;
                break;
            }
        }

        // Fallback: update the number string in the main text content
        if (!updated) {
            const numStr = extractNumberString(targetEl.textContent);
            if (numStr) {
                targetEl.textContent = targetEl.textContent.replace(numStr, formattedValue);
            }
        }
    }

    // --- GUI and Tracking Functions ---

    /**
     * Finds target elements and builds the GUI structure.
     * This function should be called initially and whenever the page structure changes.
     */
    function populateGuiStructureOnce() {
        const guiTableBody = document.getElementById('tm-robux-table-body');
        const tableSummary = document.querySelector('table.table.summary');

        if (!guiTableBody || !tableSummary) return;

        // Get the current list of targets on the page
        const allTargets = Array.from(tableSummary.querySelectorAll('.balance-label.icon-robux-container, td.amount.icon-robux-container'));

        // If the number of found targets matches what we're already tracking, skip GUI creation
        if (scriptSetupComplete && allTargets.length === trackedElements.length) {
            return;
        }

        const savedValues = JSON.parse(localStorage.getItem(SAVE_KEY)) || [];

        trackedElements = [];
        guiTableBody.innerHTML = '';

        allTargets.forEach((el, index) => {
            const originalValue = getNumberFromElement(el);
            if (originalValue === null) return;

            trackedElements.push({ element: el, originalValue });

            const savedValue = savedValues[index];
            const displayValue = savedValue !== undefined ? parseFloat(savedValue) : originalValue;

            // Get a meaningful label for the row
            const rowHeader = el.closest('tr')?.querySelector('th, td:first-child');
            const label = rowHeader?.textContent.trim() || (el.closest('.balance-label') ? 'Summary Balance' : `Summary Row #${index + 1}`);

            // Create GUI row structure
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${label}</td>
                <td><input type="number" class="tm-robux-input" data-index="${index}" value="${displayValue}" /></td>
            `;
            guiTableBody.appendChild(row);
        });

        // Re-attach listeners after rebuilding the GUI
        document.querySelectorAll('.tm-robux-input').forEach(input => {
            input.addEventListener('input', () => {
                saveValues();
            });
        });

        console.log(`Robux Changer: Rebuilt GUI inputs for ${allTargets.length} rows.`);
    }

    /**
     * Applies all saved values from localStorage to the corresponding elements on the page.
     * Also ensures the GUI inputs reflect the saved values.
     */
    function applySavedValues() {
        const tableSummary = document.querySelector('table.table.summary');
        if (!tableSummary) return;

        const savedValues = JSON.parse(localStorage.getItem(SAVE_KEY)) || [];
        // Re-query elements just in case the DOM changed
        const allTargets = Array.from(tableSummary.querySelectorAll('.balance-label.icon-robux-container, td.amount.icon-robux-container'));

        // Check 1: Ensure GUI structure matches the page structure
        if (allTargets.length !== trackedElements.length) {
             console.log(`Robux Changer: Page structure mismatch. Rebuilding GUI.`);
             populateGuiStructureOnce(); // Rebuild GUI and trackedElements list
             // After rebuilding, trackedElements should match allTargets, but we need to re-query allTargets
             // or simply proceed with the new trackedElements list which is now the source of truth for the GUI.
             // We can proceed to apply the saved values if the newly rebuilt structure matches the saved values.
        }

        // Check 2: Ensure the number of elements on the page matches the number of saved values before applying text
        if (allTargets.length === 0 || allTargets.length !== savedValues.length) {
            // Abort application of values to the page text
            // console.log(`Robux Changer: Aborting text application. Target rows (${allTargets.length}) do not match saved values (${savedValues.length}).`);
            return;
        }

        let appliedCount = 0;

        allTargets.forEach((el, index) => {
            const savedValue = savedValues[index];

            if (savedValue !== undefined && savedValue !== '') {
                const displayValue = parseFloat(savedValue);
                // 1. Update the page element
                updatePageValue(el, displayValue);
                appliedCount++;

                // 2. Ensure GUI input reflects the saved value (only if different)
                const input = document.querySelector(`.tm-robux-input[data-index="${index}"]`);
                if (input && input.value !== savedValue) {
                    // Only update the input if the script has completed its initial setup
                    // to prevent overwriting a value the user is actively typing.
                    if (scriptSetupComplete) {
                         input.value = savedValue;
                    }
                }
            }
        });
    }

    /**
     * Saves the current values from the GUI inputs to localStorage.
     */
    function saveValues() {
        const valuesToSave = trackedElements.map((_, index) => {
            const input = document.querySelector(`.tm-robux-input[data-index="${index}"]`);
            return input ? input.value : ''; // Save the string value from the input
        });
        localStorage.setItem(SAVE_KEY, JSON.stringify(valuesToSave));

        // Add a temporary visual feedback to the save button
        const saveBtn = document.getElementById('tm-robux-save');
        if (saveBtn) {
            saveBtn.textContent = '✅';
            setTimeout(() => { saveBtn.textContent = '💾'; }, 1000);
        } else {
            console.log("Robux Changer: Values saved successfully.");
        }
    }

    function resetValues() {
        if (confirm("Are you sure you want to reset all saved values and refresh?")) {
            localStorage.removeItem(SAVE_KEY);
            location.reload();
        }
    }

    function toggleGui() {
        if (!guiPanel) return;
        const isVisible = guiPanel.style.display === 'block';
        guiPanel.style.display = isVisible ? 'none' : 'block';
    }

    // --- Auto-Apply Function ---

    function autoApplyValues() {
        // This function will run repeatedly
        applySavedValues();
        // Schedule itself to run again
        setTimeout(autoApplyValues, AUTO_APPLY_INTERVAL_MS);
    }

    // --- Setup Functions ---

    function createGui() {
        guiPanel = document.createElement('div');
        guiPanel.id = 'tm-robux-changer-panel';
        guiPanel.innerHTML = `
            <div id="tm-robux-header">
                Robux Editor
                <div id="tm-robux-controls">
                    <button id="tm-robux-save" title="Save Values">💾</button>
                    <button id="tm-robux-reset" title="Reset and Reload">🗑️</button>
                    <button id="tm-robux-force-apply" title="Force Apply Once">⚡</button>
                    <button id="tm-robux-close" title="Close">×</button>
                </div>
            </div>
            <div id="tm-robux-content">
                <table>
                    <thead><tr><th>Item</th><th>Value</th></tr></thead>
                    <tbody id="tm-robux-table-body"></tbody>
                </table>
                <p style="font-size:10px;text-align:center;margin-top:5px;">Auto-applied every ${AUTO_APPLY_INTERVAL_MS / 1000}s</p>
            </div>
        `;
        document.body.appendChild(guiPanel);

        document.getElementById('tm-robux-close').addEventListener('click', toggleGui);
        document.getElementById('tm-robux-force-apply').addEventListener('click', applySavedValues);
        document.getElementById('tm-robux-save').addEventListener('click', saveValues);
        document.getElementById('tm-robux-reset').addEventListener('click', resetValues);

        // Dragging logic (kept as is)
        const header = document.getElementById('tm-robux-header');
        let isDragging = false, offset = { x: 0, y: 0 };
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - guiPanel.offsetLeft;
            offset.y = e.clientY - guiPanel.offsetTop;
            header.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            guiPanel.style.left = `${e.clientX - offset.x}px`;
            guiPanel.style.top = `${e.clientY - offset.y}px`;
        });
        document.addEventListener('mouseup', () => { isDragging = false; header.style.cursor = 'grab'; });
    }

    function setupKeyListener() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Shift' && e.location === KeyboardEvent.DOM_KEY_LOCATION_RIGHT) {
                e.preventDefault();
                toggleGui();
            }
        });
    }

    function addStyles() {
        GM_addStyle(`
            #tm-robux-changer-panel {
                position: fixed; top: 20px; right: 20px; width: 280px;
                background-color: #232527; color: #fff; border: 1px solid #393b3d;
                border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                font-family: Arial, sans-serif; font-size: 14px;
                z-index: 9999; overflow: hidden;
                display: none;
            }
            #tm-robux-header {
                padding: 10px; background-color: #393b3d; font-weight: bold;
                cursor: grab; user-select: none; display: flex;
                justify-content: space-between; align-items: center;
            }
            #tm-robux-controls button {
                background: none; border: none; color: #fff; font-size: 18px;
                cursor: pointer; padding: 2px 6px; border-radius: 4px;
                min-width: 28px;
            }
            #tm-robux-controls button:hover { background-color: #555; }
            #tm-robux-content { padding: 10px; max-height: 400px; overflow-y: auto; }
            #tm-robux-content table { width: 100%; border-collapse: collapse; }
            #tm-robux-content th, #tm-robux-content td {
                padding: 8px; text-align: left; border-bottom: 1px solid #393b3d;
            }
            #tm-robux-content th { font-weight: 600; }
            .tm-robux-input {
                width: 100%; background-color: #1a1c1e; color: #fff;
                border: 1px solid #444; border-radius: 4px; padding: 5px; box-sizing: border-box;
            }
            .tm-robux-input::-webkit-outer-spin-button, .tm-robux-input::-webkit-inner-spin-button {
                -webkit-appearance: none; margin: 0;
            }
            .tm-robux-input[type=number] { -moz-appearance: textfield; }
        `);
    }

    function setupScript() {
        if (scriptSetupComplete) return;

        addStyles();
        createGui();
        setupKeyListener();

        populateGuiStructureOnce();

        // Start the automatic application loop
        autoApplyValues();

        scriptSetupComplete = true;
        console.log("Robux Changer GUI Setup Complete. Auto-apply is active.");
    }

    function limitedCheckAndInit(maxTries = 100, currentTry = 1) {
        // Check for a specific element that indicates the transaction summary is loaded
        if (document.querySelector('table.table.summary')) {
            console.log(`Robux Changer: Target table found on try ${currentTry}.`);
            setupScript();
            return; // Stop the loop
        }

        if (currentTry < maxTries) {
            setTimeout(() => {
                limitedCheckAndInit(maxTries, currentTry + 1);
            }, 10);
        } else {
            console.warn(`Robux Changer: Target table not found after ${maxTries} attempts. Initialization aborted.`);
        }
    }

    limitedCheckAndInit();
})();