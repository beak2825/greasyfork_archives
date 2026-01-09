// ==UserScript==
// @name         PestPac Billing & Attic Note Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Billing Notes (Stacked Buttons) and Attic HHALERT Generator
// @author       Jamie Cruz
// @match        https://app.pestpac.com/notes/default.asp*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561866/PestPac%20Billing%20%20Attic%20Note%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/561866/PestPac%20Billing%20%20Attic%20Note%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------------------------------------
    // 1. CREATE CUSTOM UI ELEMENTS
    // ---------------------------------------------

    const noteField = document.getElementById('Note');
    if (!noteField) {
        console.error("PestPac Note field not found. Script stopped.");
        return;
    }

    const container = noteField.closest('div');

    // UI Structure:
    // Row 1: Inputs
    // Row 2: Billing Button
    // Row 3: Attic Button (Stacked below)
    const quickEntryHTML = `
        <div id="quickNoteGenerator" style="margin-top: 15px; padding: 10px; border: 1px solid #ccc; background-color: #f7f7f7; width: 96.5%;">
            <h4 style="margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Quick Note Generator</h4>

            <table style="width: 100%; margin-bottom: 10px;">
                <tr>
                    <td style="width: 15%;">
                        <label for="inspectorName" style="font-size: 11px; font-weight:bold;">Inspector:</label><br>
                        <input type="text" id="inspectorName" placeholder="Tech Name" value="Tech" style="width: 90%;">
                    </td>
                    <td style="width: 20%;">
                        <label for="treatmentType" style="font-size: 11px; font-weight:bold;">Treatment:</label><br>
                        <select id="treatmentType" style="width: 95%;">
                            <option value="termite treatment">Termite Treatment</option>
                            <option value="Attic remediation">Attic Remediation</option>
                            <option value="Bed bug warranty">Bed Bug Warranty</option>
                            <option value="exclusion work">Exclusion Work</option>
                        </select>
                    </td>
                    <td style="width: 15%;">
                        <label for="totalAmount" style="font-size: 11px; font-weight:bold;">Total ($):</label><br>
                        <input type="number" id="totalAmount" value="0.00" min="0" step="0.01" style="width: 90%; text-align: right;">
                    </td>
                     <td style="width: 15%;">
                        <label for="downPayment" style="font-size: 11px; font-weight:bold; color: #d9534f;">Down Pmt ($):</label><br>
                        <input type="number" id="downPayment" value="0.00" min="0" step="0.01" style="width: 90%; text-align: right; border: 1px solid #d9534f;">
                    </td>
                    <td style="width: 15%;">
                        <label for="splitCount" style="font-size: 11px; font-weight:bold;">Splits:</label><br>
                        <select id="splitCount" style="width: 90%;">
                            <option value="1">1 (None)</option>
                            <option value="2">2</option>
                            <option value="3" selected>3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </td>
                </tr>
            </table>

            <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 10px 0;">

            <div style="width: 100%;">

                <button id="generateBillingBtn" style="background-color: #4CAF50; color: white; padding: 10px; border: none; cursor: pointer; width: 100%; font-weight: bold; margin-bottom: 10px;">
                    Generate BILLING Note
                </button>

                <button id="generateAtticBtn" style="background-color: #FF9800; color: white; padding: 10px; border: none; cursor: pointer; width: 100%; font-weight: bold;">
                    Generate ATTIC Alert (HHALERT)
                </button>

            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', quickEntryHTML);

    // ---------------------------------------------
    // 2. HELPER FUNCTIONS
    // ---------------------------------------------

    function getShortDate() {
        const dateField = document.getElementById('Date');
        if(dateField && dateField.value) {
            const dateParts = dateField.value.split('/');
            let yearShort = dateParts[2].length === 4 ? dateParts[2].slice(-2) : dateParts[2];
            return `${dateParts[0]}/${dateParts[1]}/${yearShort}`;
        } else {
            const d = new Date();
            return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear().toString().slice(-2)}`;
        }
    }

    function setNoteCode(code) {
        const noteCodeField = document.getElementById('NoteCode');
        if (noteCodeField) {
            noteCodeField.value = code;
            noteCodeField.dispatchEvent(new Event('change'));
            noteCodeField.dispatchEvent(new Event('blur'));
        }
    }

    function setExpirationDate(monthsToAdd) {
        const expField = document.getElementById('ExpirationDate');
        if (expField) {
            if (monthsToAdd === 0) {
                expField.value = ""; // Clear date
            } else {
                const today = new Date();
                const futureDate = new Date(today.setMonth(today.getMonth() + monthsToAdd));
                const mm = (futureDate.getMonth() + 1).toString().padStart(2, '0');
                const dd = futureDate.getDate().toString().padStart(2, '0');
                const yyyy = futureDate.getFullYear();
                expField.value = `${mm}/${dd}/${yyyy}`;
            }
            expField.dispatchEvent(new Event('change'));
            expField.dispatchEvent(new Event('blur'));
        }
    }

    // ---------------------------------------------
    // 3. LOGIC: BILLING NOTE GENERATOR
    // ---------------------------------------------

    document.getElementById('generateBillingBtn').addEventListener('click', function(e) {
        e.preventDefault();

        // Get Values
        const treatment = document.getElementById('treatmentType').value;
        const totalStr = document.getElementById('totalAmount').value.trim();
        const downPayStr = document.getElementById('downPayment').value.trim();
        const splitCount = parseInt(document.getElementById('splitCount').value, 10);
        let inspector = document.getElementById('inspectorName').value.trim();
        if (inspector === "") inspector = "Tech";

        let total = parseFloat(totalStr);
        let downPayment = parseFloat(downPayStr);

        // Validation
        if (isNaN(total) || total <= 0) {
            alert("Please enter a valid Total Amount.");
            return;
        }
        if (isNaN(downPayment)) downPayment = 0;

        // Calculations
        const remainder = total - downPayment;
        const shortDate = getShortDate();

        // Text Construction
        let noteText = `BILLING INSTRUCTIONS\n`;

        // Line 1: Summary
        noteText += `${shortDate} ${inspector} Sold ${treatment} $${total.toFixed(2)}\n`;

        // Line 2: Down Payment (Only if exists)
        if (downPayment > 0) {
            noteText += `*Down payment of $${downPayment.toFixed(2)} was taken today*\n`;
        }

        noteText += `\n`; // Spacer

        // Line 3: Splits logic
        if (remainder <= 0) {
             noteText += `Full payment has been satisfied.`;
        } else {
            if (splitCount > 1) {
                const splitAmount = (remainder / splitCount).toFixed(2);
                noteText += `Split into ${splitCount} x $${splitAmount} upon completion`;
            } else {
                noteText += `Remaining balance of $${remainder.toFixed(2)} due upon completion`;
            }
        }

        // Apply changes
        noteField.value = noteText;
        setNoteCode('Alert'); // Standard Billing Alert
        setExpirationDate(6); // 6 Months

        // Trigger UI update
        noteField.dispatchEvent(new Event('keyup'));
    });

    // ---------------------------------------------
    // 4. LOGIC: ATTIC ALERT GENERATOR
    // ---------------------------------------------

    document.getElementById('generateAtticBtn').addEventListener('click', function(e) {
        e.preventDefault();

        const atticText = `THIS CUSTOMER IS HAVING/HAS HAD ATTIC INSULATION INSTALLED:

- If the customer(s) asks any questions about their attic/insulation/rodent problem - DO NOT ANSWER
- politely explain you don't have any of the details about their attic/insulation service
- contact the office for assistance`;

        // Apply changes
        noteField.value = atticText;
        setNoteCode('HHALERT'); // Special Code
        setExpirationDate(0);   // Clear Expiration Date (No expire)

        // Trigger UI update
        noteField.dispatchEvent(new Event('keyup'));

        alert("Attic Note Generated.\nCode: HHALERT\nExpiration: None");
    });

})();