// ==UserScript==
// @name         Quick Barcode Generator
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Robustly handles items with multiple barcodes (via aria-label) and highlighted text.
// @author       You
// @match        https://portal.foodpanda.com/pv2/sg/p/inventory/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/558661/Quick%20Barcode%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/558661/Quick%20Barcode%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION ---
    const ENABLE_BUTTON = true;
    const SHORTCUT_KEY = 'b';        // Ctrl + b
    const BUTTON_TEXT = 'Show Barcode';
    const BARCODE_LABEL = 'Barcode';
    const AUTO_CLOSE_MS = 3000;
    const REFRESH_INTERVAL = 500;    // Increased slightly for performance
    // ---------------------

    function findBarcodeOnPage() {
        // 1. Find the "Barcode" label
        const allBoldTags = document.getElementsByTagName('b');

        for (let bTag of allBoldTags) {
            if (bTag.innerText.trim() === BARCODE_LABEL) {
                const parentDiv = bTag.parentNode;

                // 2. Get ALL spans in this container (not just the first one)
                const allSpans = parentDiv.querySelectorAll('span');

                for (let span of allSpans) {
                    // CHECK A: Does this span have an aria-label with numbers? (The [+1] case)
                    // The screenshot shows: aria-label="09300697113252, 093006971132819"
                    const ariaLabel = span.getAttribute('aria-label');
                    if (ariaLabel) {
                        // Extract the first long number sequence found in the label
                        const match = ariaLabel.match(/(\d{5,})/);
                        if (match) {
                            return { element: parentDiv, value: match[0] };
                        }
                    }

                    // CHECK B: Does the visible text look like a barcode?
                    let text = span.innerText.trim();
                    // Clean up any weird invisible characters
                    text = text.replace(/[^\d,]/g, '');

                    // Handle comma lists in visible text (e.g. "12345, 67890")
                    if (text.includes(',')) {
                        text = text.split(',')[0];
                    }

                    // Validation: Must be at least 5 digits to avoid picking up the "[+1]" indicator
                    if (text.length >= 5 && /^\d+$/.test(text)) {
                        return { element: parentDiv, value: text };
                    }
                }
            }
        }
        return null;
    }

    // --- BUTTON LOGIC ---
    function addBarcodeButton() {
        const result = findBarcodeOnPage();
        if (result) {
            // Only add if button doesn't exist yet
            if (result.element.querySelector('.tm-barcode-btn')) return;

            const btn = document.createElement('button');
            btn.innerText = BUTTON_TEXT;
            btn.className = 'tm-barcode-btn';
            Object.assign(btn.style, {
                marginLeft: '15px',
                padding: '2px 8px',
                fontSize: '11px',
                cursor: 'pointer',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                verticalAlign: 'middle'
            });

            btn.addEventListener('click', function(e) {
                e.preventDefault();
                generateOverlay(result.value);
            });

            result.element.appendChild(btn);
        }
    }

    // --- SHORTCUT LOGIC ---
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === SHORTCUT_KEY) {

            // Priority 1: Highlighted Text
            let selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0) {
                // If selection has commas, take the first part
                if (selectedText.includes(',')) selectedText = selectedText.split(',')[0].trim();

                // Generate if it has digits
                if (/\d/.test(selectedText)) {
                     e.preventDefault();
                     generateOverlay(selectedText);
                     return;
                }
            }

            // Priority 2: Page Element
            const result = findBarcodeOnPage();
            if (result) {
                e.preventDefault();
                generateOverlay(result.value);
            } else {
                console.log("Quick Barcode: No valid barcode found.");
            }
        }
    });

    // --- OVERLAY GENERATOR ---
    function generateOverlay(text) {
        // Clean text one last time to ensure it's just the number
        text = text.trim();

        const existing = document.getElementById('tm-barcode-overlay');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'tm-barcode-overlay';
        Object.assign(container.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '999999',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 30px rgba(0,0,0,0.5)',
            borderRadius: '10px',
            textAlign: 'center'
        });

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        container.appendChild(svg);
        document.body.appendChild(container);

        try {
            JsBarcode(svg, text, {
                format: "CODE128",
                lineColor: "#000",
                width: 3,
                height: 100,
                displayValue: true,
                fontSize: 20
            });
        } catch (error) {
            container.innerText = "Error: " + text;
            container.style.color = "red";
            container.style.fontWeight = "bold";
        }

        container.addEventListener('click', () => container.remove());
        setTimeout(() => { if (container) container.remove(); }, AUTO_CLOSE_MS);
    }

    if (ENABLE_BUTTON) setInterval(addBarcodeButton, REFRESH_INTERVAL);
})();