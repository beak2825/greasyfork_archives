// ==UserScript==
// @name         Torn Bazaar 5% Off Calculator
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Adds 5% discount calculator to your bazaar page
// @author       SharmZ 
// @match        https://www.torn.com/bazaar.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558883/Torn%20Bazaar%205%25%20Off%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/558883/Torn%20Bazaar%205%25%20Off%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if element already exists and remove it to prevent duplicates
    const existingCalc = document.getElementById('custom-discount-calc');
    if (existingCalc) existingCalc.remove();

    // Create calculator container
    const calcBox = document.createElement('div');
    calcBox.id = 'custom-discount-calc';
    calcBox.style.position = 'fixed';
    calcBox.style.top = '175px';
    calcBox.style.left = '20px';
    calcBox.style.backgroundColor = '#1a1a1a';
    calcBox.style.color = '#e0e0e0';
    calcBox.style.padding = '15px';
    calcBox.style.border = '2px solid #d4af37';
    calcBox.style.borderRadius = '8px';
    calcBox.style.zIndex = '9999';
    calcBox.style.fontFamily = 'Arial, sans-serif';
    calcBox.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.5)';
    calcBox.style.width = '280px'; // Widened slightly to fit buttons

    // Helper function to create row HTML
    function createRow(label, color, id, btnId) {
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:#252525; padding:5px; border-radius:4px;">
            <div style="display:flex; align-items:center; gap:5px;">
                <span style="color:${color}; font-weight:bold; width: 60px;">${label}:</span>
                <span id="${id}" style="font-family:monospace; font-size:14px;">0</span>
            </div>
            <button id="${btnId}" style="
                cursor:pointer;
                background: #333;
                border: 1px solid #555;
                color: #fff;
                border-radius: 3px;
                padding: 2px 8px;
                font-size: 11px;
                transition: all 0.2s;
            ">Copy</button>
        </div>`;
    }

    // Calculator HTML
    calcBox.innerHTML = `
        <h3 style="margin:0 0 15px; color:#d4af37; text-align:center; font-size: 16px;">DISCOUNT CALCULATOR</h3>

        <div style="margin-bottom:15px; text-align:center;">
            <div style="font-size:12px; color:#aaa; margin-bottom:5px;">Original Price</div>
            <input type="number" id="discountInput" min="0" style="
                width: 90%;
                padding: 8px;
                background: #2d2d2d;
                border: 1px solid #555;
                color: #fff;
                border-radius: 4px;
                font-size: 14px;
                text-align: center;
            " placeholder="Enter amount">
        </div>

        ${createRow('5% Off', '#d4af37', 'discountResult5', 'btnCopy5')}
        ${createRow('3% Off', '#00bcd4', 'discountResult3', 'btnCopy3')}
        ${createRow('1% Off', '#4caf50', 'discountResult1', 'btnCopy1')}
    `;

    // Add to page
    document.body.appendChild(calcBox);

    // Elements
    const input = document.getElementById('discountInput');
    const results = {
        5: { span: document.getElementById('discountResult5'), btn: document.getElementById('btnCopy5'), factor: 0.95 },
        3: { span: document.getElementById('discountResult3'), btn: document.getElementById('btnCopy3'), factor: 0.97 },
        1: { span: document.getElementById('discountResult1'), btn: document.getElementById('btnCopy1'), factor: 0.99 }
    };

    // Calculation Logic
    input.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;

        Object.values(results).forEach(item => {
            const val = amount * item.factor;
            // Store raw value in dataset for easier copying later
            item.span.dataset.raw = Math.floor(val);
            item.span.textContent = val.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        });
    });

    // Copy Logic
    Object.values(results).forEach(item => {
        item.btn.addEventListener('click', function() {
            // Get raw number (no commas) from dataset, or default to 0
            const textToCopy = item.span.dataset.raw || "0";

            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual Feedback
                const originalText = this.textContent;
                this.textContent = "Copied!";
                this.style.background = "#2e7d32"; // Green background
                this.style.borderColor = "#4caf50";

                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = "#333";
                    this.style.borderColor = "#555";
                }, 1000);
            });
        });
    });

    // Initial calculation
    input.value = '';
    input.dispatchEvent(new Event('input'));
})();