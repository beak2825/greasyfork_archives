// ==UserScript==
// @name         Unified Lab Assistant & Receiver plus
// @version      18.6
// @description  v18.5: Fixed Patient Type badge for 'ER' status.
// @match        https://his.kaauh.org/lab/*
// @author       Hamad AlShegifi 
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/colresizable@1.6.0/colResizable-1.6.min.js
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// @namespace    http://tampermonkey.net/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555452/Unified%20Lab%20Assistant%20%20Receiver%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/555452/Unified%20Lab%20Assistant%20%20Receiver%20plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1) Make the UL span full width and behave as flex container
    GM_addStyle(`
        ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] {
            width: 100% !important;
            display: flex !important;
            flex-wrap: nowrap !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* 2) Make each LI grow to share the width equally */
        ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] > li {
            flex: 1 1 0 !important;
            display: flex !important;
            float: none !important; /* Override bootstrap floats */
            margin-bottom: -1px; /* Maintain border overlap if needed */
        }

        /* 3) Make the A fill its LI and center text */
        ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] > li > a {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;     /* Vertical Center */
            justify-content: center !important; /* Horizontal Center */
            width: 100% !important;
            height: 100% !important;            /* Fill the LI height */
            text-align: center !important;
            white-space: nowrap !important;
            margin: 0 !important;
            /* Border removed to preserve original styling */
        }

        /* 4) Target inner spans to ensure they don't break flow */
        ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] > li > a > span {
            display: inline-block !important;
            text-align: center !important;
        }
    `);
})();


(function() {
    'use strict';

    // Function to remove numeric-only restrictions
    function removeNumericRestriction(input) {
        if (!input || input.dataset.restrictionRemoved) return;

        input.dataset.restrictionRemoved = 'true';

        // Change input type from number to text
        if (input.type === 'number') {
            input.type = 'text';
        }

        // Remove pattern validation
        input.removeAttribute('pattern');

        // Remove maxlength
        input.removeAttribute('maxlength');

        // Remove any Angular validators by stopping validation events
        ['keydown', 'keypress', 'keyup', 'input', 'paste'].forEach(eventType => {
            input.addEventListener(eventType, function(e) {
                // Allow everything - stop Angular from blocking
                e.stopImmediatePropagation();
            }, true);
        });
    }

    // Find all target inputs
    function processAllInputs() {
        const selectors = [
            'app-result-value-render input',
            'input.lo-res-edit',
            'div[role="gridcell"] input',
            'div[col-id="TestResult"] input'
        ];

        const inputs = document.querySelectorAll(selectors.join(', '));
        inputs.forEach(input => {
            removeNumericRestriction(input);
        });
    }

    // Run immediately
    processAllInputs();

    // Watch for new inputs added dynamically
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    if (node.matches && node.matches('input')) {
                        removeNumericRestriction(node);
                    }
                    if (node.querySelectorAll) {
                        const inputs = node.querySelectorAll('input.lo-res-edit, app-result-value-render input, div[role="gridcell"] input');
                        inputs.forEach(input => {
                            removeNumericRestriction(input);
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

(function() {
    'use strict';

    // Global namespace
    window.enhancedGrid = window.enhancedGrid || {};
    window.enhancedGrid.summaryPopulated = false; // Flag to ensure summary updates only once

    // --- Utility function to wait for dynamically loaded elements (from Rapid Receiver) ---
    function waitForKeyElements(selector, callback, bWaitOnce) {
        var targetNodes, bDone = false;
        targetNodes = $(selector);
        if (targetNodes && targetNodes.length > 0) {
            targetNodes.each(function() { callback($(this)); });
            bDone = bWaitOnce;
        }
        var obs = new MutationObserver(function(mutations) {
            if (bDone) { obs.disconnect(); return; }
            mutations.forEach(function(mutation) {
                var newNodes = mutation.addedNodes;
                if (newNodes && newNodes.length > 0) {
                    for (var i = 0, len = newNodes.length; i < len; i++) {
                        var newNode = newNodes[i];
                        if (newNode.nodeType === 1) {
                            var $node = $(newNode);
                            if ($node.is(selector)) {
                                callback($node);
                                if (bWaitOnce) bDone = true;
                            } else if ($node.find(selector).length > 0) {
                                $node.find(selector).each(function() { callback($(this)); });
                                if (bWaitOnce) bDone = true;
                            }
                        }
                    }
                }
            });
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    // ==========================================
    // --- RAPID BARCODE RECEIVER FUNCTIONS ---
    // ==========================================

// ===============================================
// --- RAPID BARCODE RECEIVER UI (UI-ONLY MODE) ---
// Delegates actual receiving/processing to Script #1 (Batch Collector v3)
// Requires Script #1 to expose: window.BatchCollectorV3.addMany() + process()
// ===============================================

function initializeScript() {
    const closeButtonSelector = "#closebtn-smplrecieve, #btnclose-smplcollection";

    waitForKeyElements(closeButtonSelector, function(closeButton) {
        // Avoid duplicate injection
        if (closeButton.parent().find("#rapidReceiveBtn").length > 0) return;

        // Add Rapid Receiver button near existing close button
        let rapidReceiveBtn = $('<button type="button" class="btn btn-color-1" id="rapidReceiveBtn">Rapid Receiver</button>');
        rapidReceiveBtn.css("margin-right", "5px");
        closeButton.before(rapidReceiveBtn);

        // Create modal only once
        if ($("#rapidReceiveModal").length === 0) {
            let modalHTML = `
                <div id="rapidReceiveModal" class="rr-modal-backdrop">
                    <div class="rr-modal-content">
                        <div class="rr-modal-header">
                            <h2>Rapid Barcode Processor</h2>
                            <span class="rr-close-button">&times;</span>
                        </div>

                        <div class="rr-modal-body">
                            <input type="text" id="newBarcodeEntry" placeholder="Scan or paste barcodes here and press Enter">
                            <div id="rr-table-container">
                                <table id="barcodeTable">
                                    <thead>
                                        <tr>
                                            <th class="rr-th-no">No.</th>
                                            <th class="rr-th-barcode">Barcode</th>
                                            <th class="rr-th-location">Location</th>
                                            <th class="rr-th-status">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody id="barcodeListBody"></tbody>
                                </table>
                            </div>
                        </div>

                        <div class="rr-modal-footer">
                            <span id="rr-counter" class="rr-counter-style">0 Barcodes Entered</span>
                            <div>
                                <button id="clearBarcodesBtn" class="btn btn-danger">Clear</button>
                                <button id="processBarcodesBtn" class="btn btn-success">Process</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $("body").append(modalHTML);

            GM_addStyle(`
                .rr-modal-backdrop {
                    display: none;
                    position: fixed;
                    z-index: 9999;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0,0,0,0.6);
                }
                .rr-modal-content {
                    display: flex;
                    flex-direction: column;
                    background-color: #f8f9fa;
                    margin: 5% auto;
                    padding: 25px;
                    border: none;
                    width: 90%;
                    max-width: 900px;
                    border-radius: 8px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    height: 80vh;
                }
                .rr-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #dee2e6;
                    padding-bottom: 15px;
                    margin-bottom: 15px;
                }
                .rr-modal-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    color: #343a40;
                }
                .rr-modal-body {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .rr-modal-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px solid #dee2e6;
                    padding-top: 15px;
                    margin-top: 15px;
                }
                .rr-close-button {
                    color: #aaa;
                    font-size: 32px;
                    font-weight: bold;
                    cursor: pointer;
                    line-height: 1;
                    width: 32px;
                    text-align: center;
                }
                .rr-close-button:hover { color: black; }

                #newBarcodeEntry {
                    width: 100%;
                    padding: 10px;
                    font-size: 16px;
                    margin-bottom: 15px;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                #newBarcodeEntry:focus {
                    border-color: #80bdff;
                    outline: 0;
                    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
                }
                #rr-table-container {
                    flex-grow: 1;
                    overflow-y: auto;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    background-color: #fff;
                }
                #barcodeTable {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                #barcodeTable th, #barcodeTable td {
                    padding: 4px 15px;
                    text-align: left;
                    border-bottom: 1px solid #e9ecef;
                    vertical-align: middle;
                }
                #barcodeTable th {
                    background-color: #e9ecef;
                    color: #495057;
                    position: sticky;
                    top: 0;
                    z-index: 5;
                }
                #barcodeTable th:not(:last-child),
                #barcodeTable td:not(:last-child) {
                    border-right: 1px solid #dee2e6 !important;
                }
                #barcodeTable tbody tr:nth-child(even) { background-color: #f8f9fa; }

                .rr-th-no { width: 5%; }
                .rr-th-barcode { width: 35%; }
                .rr-th-location { width: 15%; }
                .rr-th-status { width: 45%; }

                td.status-cell { font-weight: bold; }
                td.status-cell.success { text-align: center; color: green; font-size: 1.2rem; }

                .rr-counter-style { font-size: 14px; font-weight: bold; color: #555; }
                #clearBarcodesBtn { margin-right: 10px; }
                .rr-error-text { color: #D8000C; font-weight: bold; font-size: 12px; }

                .JCLRgrip { background-color: #007bff !important; width: 3px !important; z-index: 99999 !important; }
            `);

            // Delay initialization to prevent conflicts
            setTimeout(() => {
                try {
                    $("#barcodeTable").colResizable({
                        liveDrag: true,
                        gripInnerHtml: "<div class='JCLRgrip'></div>",
                        minWidth: 30
                    });
                } catch (e) {
                    // ignore if plugin not ready
                }
            }, 100);
        }

        // Cache elements
        const rapidReceiveModal = $("#rapidReceiveModal");
        const barcodeListBody = $("#barcodeListBody");
        const newBarcodeEntry = $("#newBarcodeEntry");
        const rrCounter = $("#rr-counter");
        const processBtn = $("#processBarcodesBtn");
        const clearBtn = $("#clearBarcodesBtn");

        // ---------- UI Helpers ----------
        function calculateLocation(index) {
            const letter = String.fromCharCode(65 + Math.floor(index / 10));
            const number = (index % 10) + 1;
            return `${letter}${number}`;
        }

        function updateBarcodeCount() {
            const count = barcodeListBody.find("tr").length;
            rrCounter.text(`${count} Barcodes Entered`).css("color", "#555");
        }

        function clearAllBarcodes() {
            barcodeListBody.empty();
            newBarcodeEntry.val("").prop("disabled", false);
            updateBarcodeCount();
        }

        function addBarcodeToTable(barcode) {
            barcode = (barcode || "").trim();
            if (!barcode) return;

            // prevent duplicates
            const current = new Set();
            barcodeListBody.find("td:nth-child(2)").each(function() {
                current.add($(this).text().trim());
            });
            if (current.has(barcode)) return;

            const rowIndex = barcodeListBody.find("tr").length;
            const rowNum = rowIndex + 1;
            const location = calculateLocation(rowIndex);

            const newRow = $(`
                <tr>
                    <td>${rowNum}</td>
                    <td>${barcode}</td>
                    <td>${location}</td>
                    <td class="status-cell"></td>
                </tr>
            `);

            barcodeListBody.append(newRow);
            updateBarcodeCount();
        }

        function handleBarcodeEntry(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                const barcode = $(this).val();
                addBarcodeToTable(barcode);
                $(this).val("");
            }
        }

        function handleBarcodePaste(event) {
            event.preventDefault();
            const pastedText = (event.originalEvent && event.originalEvent.clipboardData)
                ? event.originalEvent.clipboardData.getData("text/plain")
                : "";

            const barcodes = pastedText
                .split(/\r?\n|,|\t|;/)
                .map(x => x.trim())
                .filter(Boolean);

            barcodes.forEach(addBarcodeToTable);
            $(this).val("");
        }

        // ---------- Delegated Processing (to Script #1) ----------
        async function processBarcodes() {
            const rowsToProcess = barcodeListBody.find("tr");

            if (rowsToProcess.length === 0) {
                alert("No barcodes to process.");
                return;
            }

            if (!window.BatchCollectorV3 || !window.BatchCollectorV3.isReady || !window.BatchCollectorV3.isReady()) {
                alert("Batch Collector v3 (script #1) is not ready. Enable it and open the page that contains #barcodecollection.");
                return;
            }

            processBtn.prop("disabled", true).text("Sending...");
            clearBtn.prop("disabled", true);
            newBarcodeEntry.prop("disabled", true);

            try {
                const barcodes = [];
                rowsToProcess.each(function() {
                    const barcode = $(this).find("td:nth-child(2)").text().trim();
                    if (barcode) barcodes.push(barcode);
                });

                // send to Script #1 queue
                window.BatchCollectorV3.addMany(barcodes);

                // mark as queued in THIS UI
                rowsToProcess.each(function() {
                    $(this).find("td.status-cell")
                        .removeClass("success")
                        .html('<span style="color:#17a2b8; font-weight:bold; font-size:11px;">Queued</span>');
                });

                rrCounter.text(`Queued ${barcodes.length}. Processing...`).css("color", "#17a2b8");

                // trigger Script #1 processing
                window.BatchCollectorV3.process();

                rrCounter.text("Sent to Batch Collector ✔").css("color", "green");
            } catch (e) {
                console.error(e);
                rrCounter.text("Error").css("color", "red");
                alert("Error while sending barcodes to Batch Collector.");
            } finally {
                processBtn.prop("disabled", false).text("Process");
                clearBtn.prop("disabled", false);
                newBarcodeEntry.prop("disabled", false).focus();
            }
        }

        function openRapidReceiver() {
            rapidReceiveModal.show();
            clearAllBarcodes();
            newBarcodeEntry.focus();
            rrCounter.css("color", "#555");
            processBtn.prop("disabled", false).text("Process");
            clearBtn.prop("disabled", false);
        }

        // ---------- Event bindings (prevent duplicates) ----------
        $("body").off("click.rr", ".rr-close-button");
        $("body").on("click.rr", ".rr-close-button", () => rapidReceiveModal.hide());

        $(window).off("click.rr");
        $(window).on("click.rr", (event) => {
            if ($(event.target).is(rapidReceiveModal)) rapidReceiveModal.hide();
        });

        $("body").off("click.rr", "#processBarcodesBtn");
        $("body").on("click.rr", "#processBarcodesBtn", processBarcodes);

        $("body").off("click.rr", "#clearBarcodesBtn");
        $("body").on("click.rr", "#clearBarcodesBtn", clearAllBarcodes);

        $("body").off("keydown.rr", "#newBarcodeEntry");
        $("body").on("keydown.rr", "#newBarcodeEntry", handleBarcodeEntry);

        $("body").off("paste.rr", "#newBarcodeEntry");
        $("body").on("paste.rr", "#newBarcodeEntry", handleBarcodePaste);

        closeButton.parent().off("click.rr", "#rapidReceiveBtn");
        closeButton.parent().on("click.rr", "#rapidReceiveBtn", openRapidReceiver);
    }, true);
}

// Start Rapid Receiver UI lifecycle
initializeScript();


    // --- END OF RAPID BARCODE RECEIVER FUNCTIONS ---

    // ==========================================
    // MODERN SUMMARY TABLE - HYBRID UI (v16.1)
    // ==========================================

    GM_addStyle(`
  /* Make the tab bar flex so items share width */
  ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] {
    width: 100% !important;
    display: flex !important;
    flex-wrap: nowrap !important;
  }

  /* Each tab takes equal width */
  ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] > li {
    flex: 1 1 0 !important;
  }

  /* Center text inside each tab */
  ul.nav.nav-tabs.tab-container.widget-tabs[role="tablist"] > li > a {
    display: flex !important;
    align-items: center;       /* vertical center */
    justify-content: center;  /* horizontal center */
    width: 100% !important;
    text-align: center !important;
    white-space: nowrap;      /* keep label on one line */
  }

        /* --- v16: Main Container --- */
        #test-summary-container {
            width: 44%;
            float: left;
            margin: 10px 5px 5px 0;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.12);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* --- v16: Actionable Header --- */
        .modern-summary-header {
            background-color: #34495e; /* Fallback */
            color: white;
            padding: 10px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.3s ease, color 0.3s ease;
            border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .modern-summary-header h2 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
            line-height: 1.2;
        }
        .header-meta {
            font-size: 11px;
            font-weight: 500;
            opacity: 0.9;
            margin-top: 2px;
        }

        /* --- v16: Controls Bar --- */
        .controls-bar {
            padding: 8px 10px;
            background: white;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
            align-items: center;
        }
        .search-box { flex: 1; min-width: 150px; position: relative; }
        .search-box input {
            width: 100%; padding: 4px 8px 4px 28px; border: 2px solid #ddd;
            border-radius: 6px; font-size: 12px; transition: all 0.2s;
        }
        .search-box input:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1); }
        .search-icon { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #6c757d; }
        .filter-buttons { display: flex; gap: 4px; flex-wrap: wrap; }
        .filter-btn {
            padding: 3px 6px; border: 2px solid #ddd; background: white;
            border-radius: 6px; font-size: 10px; font-weight: 500;
            cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;
        }
        .filter-btn:hover { background: #f8f9fa; }
        .filter-btn.active { background: #3498db; color: white; border-color: #3498db; }
        .filter-btn .count { background: rgba(0,0,0,0.1); padding: 1px 4px; border-radius: 10px; font-size: 9px; font-weight: 600; }
        .filter-btn.active .count { background: rgba(255,255,255,0.2); }

        /* --- v16: Pulsing "Ordered" Button --- */
        @keyframes pulse-red {
            0% { box-shadow: 0 0 0 0px rgba(231, 76, 60, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0px rgba(231, 76, 60, 0); }
        }
        .filter-btn.pulse-red {
            background-color: #e74c3c; color: white; border-color: #e74c3c;
            animation: pulse-red 2s infinite;
        }
        .filter-btn.pulse-red .count { background: rgba(255, 255, 255, 0.2); }

        /* --- v16.1: Table Container & Header --- */
        .table-container { flex-grow: 1; }
        .tests-table { width: 100%; border-collapse: collapse; }
        .tests-table thead { background: #f8f9fa; position: sticky; top: 0; z-index: 10; }
        .tests-table th {
            padding: 6px 6px;
            text-align: left; font-size: 10px; font-weight: 600;
            text-transform: uppercase; letter-spacing: 0.5px; color: #2c3e50;
            border-bottom: 2px solid #ddd; white-space: nowrap;
        }
        .tests-table th.center { text-align: center; }
        .tests-table th.right { text-align: right; }

        /* --- v16.1: Table Row --- */
        .tests-table tbody tr {
            border-bottom: 1px solid #e9ecef;
        }
        .tests-table tbody tr:not(.critical-row-high):not(.critical-row-low) {
            transition: background-color 0.15s;
        }
        .tests-table tbody tr:not(.critical-row-high):not(.critical-row-low):hover {
            background-color: #f8f9fa;
        }
        .tests-table td {
            padding: 2px 6px;
            font-size: 15px;
            vertical-align: middle;
        }
        .test-name { font-weight: 800; color: #000000; white-space: nowrap; }

        /* --- v16.1: Flagged Rows/Values --- */
        .tests-table tbody tr.flagged-H { background: #ffe0e0; }
        .tests-table tbody tr.flagged-L { background: #e0f2f7; }
        .tests-table tbody tr:not(.critical-row-high).flagged-H:hover { background: #ffd0d0; }
        .tests-table tbody tr:not(.critical-row-low).flagged-L:hover { background: #d0eafc; }

        .result-value { font-weight: 800; text-align: right; }
        .result-value.flagged-H { color: #000000; }
        .result-value.flagged-L { color: #000000; }
        .flag-indicator {
            display: inline-flex; align-items: center; justify-content: center;
            width: 16px; height: 16px; border-radius: 50%;
            font-size: 12px; font-weight: 700; color: white;
        }
        .flag-indicator.H { background: #e74c3c; }
        .flag-indicator.L { background: #3498db; }
        .tests-table td.center { text-align: center; }

        /* --- Breathing Critical Rows --- */
        @keyframes pulse-dark-red {
            0%   { background-color: #c0392b; }
            50%  { background-color: #e74c3c; }
            100% { background-color: #c0392b; }
        }
        @keyframes pulse-dark-blue {
            0%   { background-color: #2980b9; }
            50%  { background-color: #3498db; }
            100% { background-color: #2980b9; }
        }

        .tests-table tbody tr.critical-row-high {
            animation: pulse-dark-red 2s infinite !important;
            font-weight: bold;
            color: #ffffff !important;
        }
        .tests-table tbody tr.critical-row-low {
            animation: pulse-dark-blue 2s infinite !important;
            font-weight: bold;
            color: #ffffff !important;
        }
        .tests-table tbody tr.critical-row-high .test-name,
        .tests-table tbody tr.critical-row-high .uom,
        .tests-table tbody tr.critical-row-high .ref-range,
        .tests-table tbody tr.critical-row-high .result-value,
        .tests-table tbody tr.critical-row-low .test-name,
        .tests-table tbody tr.critical-row-low .uom,
        .tests-table tbody tr.critical-row-low .ref-range,
        .tests-table tbody tr.critical-row-low .result-value {
             color: inherit !important;
             font-weight: bold;
        }
        .tests-table tbody tr.critical-row-high .critial-alret-indication,
        .tests-table tbody tr.critical-row-low .critial-alret-indication {
            font-weight: bold;
            color: #ffffff;
        }
        .tests-table tbody tr.critical-row-high .critial-alret-indication i,
        .tests-table tbody tr.critical-row-low .critial-alret-indication i {
            color: #ffffff;
            margin-right: 3px;
        }

        /* --- v16.1: UOM/RefRange --- */
        .uom, .ref-range {
            color: #6c757d;
            font-size: 11px;
            width: 1%;
            white-space: nowrap;
        }
        .ref-range { text-align: center; }

        /* --- v16.1: Status Badges --- */
        .status-badge {
            display: inline-flex; align-items: center; justify-content: center;
            gap: 4px; padding: 2px 5px; border-radius: 12px;
            font-size: 10px; font-weight: 600; text-transform: capitalize;
            min-width: 75px; text-align: center;
        }
        .critical-row-high .status-badge,
        .critical-row-low .status-badge {
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
        }
        .critical-row-high .status-icon,
        .critical-row-low .status-icon {
            background-color: #ffffff;
        }
        .status-badge.resulted { background: #fff3cd; color: #856404; }
        .status-badge.ordered { background: #d1ecf1; color: #0c5460; }
        .status-badge.verified1 { background: #d4edda; color: #155724; }
        .status-badge.verified2 { background: #c3e6cb; color: #0d4d1a; }
        .status-badge.default { background: #e2e3e5; color: #383d41; }
        .status-icon {
            width: 6px; height: 6px; border-radius: 50%; display: inline-block;
        }
        .status-icon.resulted { background: #f39c12; }
        .status-icon.ordered { background: #17a2b8; }
        .status-icon.verified1 { background: #90EE90; }
        .status-icon.verified2 { background: #27ae60; }
        .status-icon.default { background: #868e96; }

        /* --- v16: Empty State & Footer --- */
        .empty-state { padding: 50px 20px; text-align: center; color: #6c757d; }
        .empty-state-icon { font-size: 42px; margin-bottom: 12px; opacity: 0.3; }
        .summary-footer {
            padding: 8px 10px; background: #f8f9fa; border-top: 1px solid #e0e0e0;
            display: flex; justify-content: space-between; align-items: center;
            font-size: 10px; color: #6c757d; flex-shrink: 0;
        }

        /* --- v18.4: Patient Type Badge --- */
        .patient-type-badge {
            position: absolute;
            top: 0;
            left: 0;
            background-color: #007bff; /* Default Blue */
            color: white;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: bold;
            border-bottom-right-radius: 8px;
            border-top-left-radius: 4px;
            box-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            z-index: 5;
            text-transform: uppercase;
        }
        .patient-type-badge.in-patient {
            background-color: #d32f2f; /* Red/Maroon */
        }
        .patient-type-badge.out-patient {
            background-color: #388e3c; /* Green */
        }
        .patient-img {
            position: relative !important;
            overflow: hidden; /* Ensures badge stays within bounds if rounded */
        }
    `);

    // ==========================================
    // TEST DATA COLLECTION & PROCESSING
    // ==========================================

    const CONFIG = {
        COLUMN_PATTERNS: {
            TEST_DESC: ['testdesc', 'testdescription', 'name'],
            STATUS: ['resultstatus', 'teststatus', 'status', 'state'],
            RESULT_VALUE: ['testresult'],
            UOM: ['uom', 'uomvalue'],
            REFERENCE_RANGE: ['referencerange', 'range'],
            FLAG_CRITICAL: ['ltflag']
        }
    };
    const testSortOrder = [
        'sodium (na)', 'potassium', 'chloride', 'urea (bun)', 'creatinine', 'calcium',
        'phosphate (phos)', 'magnesium (mg)', 'alkaline phosphatase (alpi)',
        'Alanine Amino Transferase (ALTI)', 'Aspartate Amino Transferase(AST)',
        'total protein (tp)', 'albumin (alb)', 'Bilirubin - Total (TBIL)',
        'Bilirubin - Direct (DBIL)', 'cholesterol', 'triglycerides',
        'high density lipoprotein - hdl', 'low density lipoprotein - ldl',
        'creatine kinase (ck)', 'lactate dehydrogenase (ldh)', 'troponin -i (ctn-1)',
        'haemoglobin a1c (hba1c)', 'tsh (thyroid stimulating hormone)-tft', 'uric acid',
        'mid stream urine'
    ];
    function getSortIndex(testName) {
        const lowerTestName = testName.toLowerCase();
        const index = testSortOrder.findIndex(sortedName =>
            lowerTestName.includes(sortedName.toLowerCase())
        );
        return index === -1 ? Infinity : index;
    }

    const findCellByPatterns = (row, patterns) => {
        for (const cell of row.querySelectorAll('[col-id]')) {
            const colId = cell.getAttribute('col-id')?.toLowerCase();
            if (colId && patterns.includes(colId)) return cell;
        }
        return null;
    };

    function parseRangeAndCompare(rangeStr, value) {
        if (!rangeStr || value === null || isNaN(parseFloat(value))) return null;
        const numVal = parseFloat(value);
        const stdRange = rangeStr.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
        if (stdRange) {
            const lower = parseFloat(stdRange[1]);
            const upper = parseFloat(stdRange[2]);
            if (numVal < lower) return 'L';
            if (numVal > upper) return 'H';
        }
        const ltRange = rangeStr.match(/(?:<|Less than)\s*(\d+\.?\d*)/i);
        if (ltRange) {
            if (numVal >= parseFloat(ltRange[1])) return 'H';
        }
        const gtRange = rangeStr.match(/(?:>|Greater than)\s*(\d+\.?\d*)/i);
        if (gtRange) {
            if (numVal <= parseFloat(gtRange[1])) return 'L';
        }
        return null;
    }

    function getAllTests() {
        const leftRows = document.querySelectorAll('.ag-pinned-left-cols-container .ag-row');
        const centerRows = document.querySelectorAll('.ag-center-cols-container .ag-row');
        const rightRows = document.querySelectorAll('.ag-pinned-right-cols-container .ag-row');
        const combinedRows = [];

        for (let i = 0; i < centerRows.length; i++) {
            const combined = document.createElement('div');
            [leftRows[i], centerRows[i], rightRows[i]].forEach(p => {
                if (p) p.querySelectorAll('[col-id]').forEach(c => combined.appendChild(c.cloneNode(true)));
            });
            combinedRows.push(combined);
        }

        const uniqueTests = new Map();
        for (const [index, combined] of combinedRows.entries()) {
            const nameCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.TEST_DESC);
            const testName = nameCell?.textContent?.trim();
            if (!testName) continue;

            const statusCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.STATUS);
            const status = statusCell?.textContent?.trim().toLowerCase() || 'unknown';

            let data = {
                name: testName,
                status: status,
                value: null,
                uom: null,
                range: null,
                flag: null,
                criticalFlag: null,
                originalIndex: index
            };

            const valCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.RESULT_VALUE);
            const rangeCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.REFERENCE_RANGE);
            const uomCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.UOM);

            data.value = valCell?.textContent?.trim() || null;
            data.range = rangeCell?.textContent?.trim() || null;
            data.uom = uomCell?.textContent?.trim() || null;
            data.flag = parseRangeAndCompare(data.range, data.value);

            // Check for Critical Flags
            const criticalFlagCell = findCellByPatterns(combined, CONFIG.COLUMN_PATTERNS.FLAG_CRITICAL);
            if (criticalFlagCell) {
                const textSpan = criticalFlagCell.querySelector('span.critial-alret-indication');
                const icon = criticalFlagCell.querySelector('i.fa');
                if (textSpan && icon) {
                    const flagText = textSpan.textContent.trim();
                    const iconClasses = icon.className;

                    if ((flagText === 'CL' || flagText === 'CH') && iconClasses.includes('critical')) {
                        data.criticalFlag = {
                            text: flagText,
                            iconClass: iconClasses
                        };
                    }
                }
            }

            uniqueTests.set(testName, data);
        }
        return Array.from(uniqueTests.values());
    }


    // ==========================================
    // MODERN SUMMARY TABLE RENDERING
    // ==========================================

    const FILTER_STORAGE_KEY = 'labSummaryFilter';
    let currentFilter = localStorage.getItem(FILTER_STORAGE_KEY) || 'all';
    let searchTerm = '';
    let allTestsData = [];

    function normalizeStatus(status) {
        const normalized = status.toLowerCase().replace(/\s+/g, '');
        if (normalized.includes('verifiedlevel1') || (normalized.includes('verified') && normalized.includes('1'))) return 'verified1';
        if (normalized.includes('verifiedlevel2') || (normalized.includes('verified') && normalized.includes('2'))) return 'verified2';
        if (normalized === 'resulted') return 'resulted';
        if (normalized === 'ordered') return 'ordered';
        return 'default';
    }

    function getStatusLabel(status) {
        const statusMap = {
            'verified1': 'Verified L1',
            'verified2': 'Verified L2',
            'resulted': 'Resulted',
            'ordered': 'Ordered'
        };
        return statusMap[status] || status;
    }


    function renderModernTable() {
        const tbody = document.getElementById('modernTestsTableBody');
        const emptyState = document.getElementById('modernEmptyState');
        const tableContainer = document.querySelector('.table-container');

        if (!tbody) return;

        let filteredTests = allTestsData.filter(test => {
            if (currentFilter === 'all') { /* No filter */ }
            else if (currentFilter === 'flagged') { if (!test.flag && !test.criticalFlag) return false; }
            else { if (normalizeStatus(test.status) !== currentFilter) return false; }

            if (searchTerm) {
                if (!test.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            }
            return true;
        });

        tbody.innerHTML = '';

        if (filteredTests.length === 0) {
            emptyState.style.display = 'block';
            if(tableContainer) tableContainer.querySelector('.tests-table').style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            if(tableContainer) tableContainer.querySelector('.tests-table').style.display = 'table';

            filteredTests.forEach(test => {
                const statusClass = normalizeStatus(test.status);
                const rowId = test.originalIndex;

                let criticalClass = '';
                if (test.criticalFlag) {
                    if (test.criticalFlag.text === 'CL') {
                        criticalClass = 'critical-row-low';
                    } else if (test.criticalFlag.text === 'CH') {
                        criticalClass = 'critical-row-high';
                    }
                }
                let valueClass = !test.criticalFlag && test.flag ? `flagged-${test.flag}` : '';

                let flagHtml = '--';
                if (test.criticalFlag) {
                    // --- MODIFIED LOGIC: Replace CH/CL text ---
                    let displayCriticalText = test.criticalFlag.text;
                    if (displayCriticalText === 'CH') displayCriticalText = 'CRITICAL HIGH';
                    if (displayCriticalText === 'CL') displayCriticalText = 'CRITICAL LOW';

                    flagHtml = `<span class="critial-alret-indication">
                                    <i class="${test.criticalFlag.iconClass}" aria-hidden="true"></i>
                                    ${displayCriticalText}
                                </span>`;
                } else if (test.flag) {
                    flagHtml = `<span class="flag-indicator ${test.flag}">${test.flag}</span>`;
                }

                const truncatedName = test.name.length > 30 ? test.name.substring(0, 30) + '...' : test.name;

                const row = document.createElement('tr');
                row.className = `${valueClass} ${criticalClass}`.trim();
                row.innerHTML = `
                <td class="test-name" title="${test.name}">${truncatedName}</td>
                <td class="result-value ${valueClass}">${test.value || '--'}</td>
                <td class="uom">${test.uom || '--'}</td>
                <td class="ref-range">${test.range || '--'}</td>
                <td class="center">
                    ${flagHtml}
                </td>
                <td class="center">
                    <span class="status-badge ${statusClass}">
                        <span class="status-icon ${statusClass}"></span>
                        ${getStatusLabel(statusClass)}
                    </span>
                </td>
            `;
                tbody.appendChild(row);
            });
        }
        updateDisplayInfo(filteredTests.length);
    }

    function updateModernCounts() {
        const counts = {
            total: allTestsData.length,
            resulted: 0,
            verified1: 0,
            verified2: 0,
            flagged: 0,
            ordered: 0
        };
        allTestsData.forEach(test => {
            const status = normalizeStatus(test.status);
            if (status === 'resulted') counts.resulted++;
            if (status === 'verified1') counts.verified1++;
            if (status === 'verified2') counts.verified2++;
            if (status === 'ordered') counts.ordered++;
            if (test.flag || test.criticalFlag) counts.flagged++;
        });
        const updateElement = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };

        updateElement('modernAllCount', counts.total);
        updateElement('modernOrderedFilterCount', counts.ordered);
        updateElement('modernResultedFilterCount', counts.resulted);
        updateElement('modernVerified1FilterCount', counts.verified1);
        updateElement('modernVerified2FilterCount', counts.verified2);
        updateElement('modernFlaggedFilterCount', counts.flagged);

        const orderedBtn = document.querySelector('.filter-btn[data-filter="ordered"]');
        if (orderedBtn) {
            orderedBtn.classList.toggle('pulse-red', counts.ordered > 0);
        }

        return counts;
    }

    function updateDisplayInfo(showing) {
        const el = document.getElementById('modernDisplayInfo');
        if (el) el.textContent = `Showing ${showing} of ${allTestsData.length} tests`;
    }

    function updateActiveFilterButton(filterName) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const newActiveBtn = document.querySelector(`.filter-btn[data-filter="${filterName}"]`);
        if (newActiveBtn) newActiveBtn.classList.add('active');
    }

function updateActionableHeader(counts) {
    const headerTitle = document.querySelector('.modern-summary-header h2');
    const headerMeta = document.querySelector('.modern-summary-header .header-meta');
    const lastUpdate = document.getElementById('modernLastUpdate')?.textContent || '--';

    if (!headerTitle || !headerMeta) return;

    if (counts.total === 0) {
        headerTitle.textContent = 'UNKNOWN';
        headerMeta.textContent = 'No test data loaded';
        return;
    }

    const { ordered, resulted } = counts;
    const pendingTotal = ordered + resulted;
    let title = "";
    let metaHTML = "";

    const totalTestsSpan = `<span style="background-color: #000000; color: #ffffff; padding: 2px 6px; border-radius: 4px; font-size: 16px; font-weight: bold;">TOTAL TESTS: ${counts.total}</span>`;

    if (pendingTotal > 0) {
        if (ordered > 0 && resulted > 0) {
            title = "ACTION REQUIRED! : Waiting for Result & Verification";
            metaHTML = `${pendingTotal} Pending Test${pendingTotal > 1 ? 's' : ''} | ${totalTestsSpan}`;

        } else if (resulted > 0) {
            title = "ACTION REQUIRED! : Verification Required";
            metaHTML = `${resulted} Resulted Test${resulted > 1 ? 's' : ''} | ${totalTestsSpan}`;

        } else if (ordered > 0) {
            title = "ACTION REQUIRED! : Waiting for Results";
            metaHTML = `${ordered} Pending Test${ordered > 1 ? 's' : ''} | ${totalTestsSpan}`;
        }

        headerTitle.textContent = title;
        headerMeta.innerHTML = metaHTML;

    } else {
        headerTitle.textContent = 'All Clear: No Pending Actions';
        headerMeta.innerHTML = `${totalTestsSpan} | Last updated: ${lastUpdate}`;
    }
}


    function syncHeaderColor(counts) {
        const summaryHeader = document.querySelector('.modern-summary-header');
        if (!summaryHeader) return;

        const yellowBg = '#f1c40f';
        const darkText = '#2c3e50';
        const greenBg = '#2ecc71';
        const whiteText = '#ffffff';
        const greyBg = '#808080';

        if (counts.total === 0) {
            if (summaryHeader.style.backgroundColor !== greyBg) {
                summaryHeader.style.backgroundColor = greyBg;
            }
            if (summaryHeader.style.color !== whiteText) {
                summaryHeader.style.color = whiteText;
            }
            return;
        }

        const pending = counts.ordered + counts.resulted;

        let newBgColor = (pending > 0) ? yellowBg : greenBg;
        let newTextColor = (pending > 0) ? darkText : whiteText;

        if (summaryHeader.style.backgroundColor !== newBgColor) {
            summaryHeader.style.backgroundColor = newBgColor;
        }
        if (summaryHeader.style.color !== newTextColor) {
            summaryHeader.style.color = newTextColor;
        }
    }

    function updateModernTimestamp() {
        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        const timestampEl = document.getElementById('modernTimestamp');
        const lastUpdateEl = document.getElementById('modernLastUpdate');

        if (timestampEl) timestampEl.textContent = `Updated: ${formatted}`;
        if (lastUpdateEl) lastUpdateEl.textContent = formatted;
    }

    function initializeModernSummaryTable() {
        const container = document.getElementById('test-summary-container');
        if (!container) return;

        container.innerHTML = `
            <div class="modern-summary-header">
                <div class="header-info">
                    <h2>Loading...</h2>
                    <div class="header-meta">--</div>
                </div>
            </div>

            <div class="controls-bar">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="modernSearchInput" placeholder="Search tests...">
                </div>
                <div class="filter-buttons">
                    <button class="filter-btn" data-filter="all">
                        All <span class="count" id="modernAllCount">0</span>
                    </button>
                    <button class="filter-btn" data-filter="ordered">
                        Ordered <span class="count" id="modernOrderedFilterCount">0</span>
                    </button>
                    <button class="filter-btn" data-filter="resulted">
                        Resulted <span class="count" id="modernResultedFilterCount">0</span>
                    </button>
                    <button class="filter-btn" data-filter="verified1">
                        L1 <span class="count" id="modernVerified1FilterCount">0</span>
                    </button>
                    <button class="filter-btn" data-filter="verified2">
                        L2 <span class="count" id="modernVerified2FilterCount">0</span>
                    </button>
                    <button class="filter-btn" data-filter="flagged">
                        Flagged <span class="count" id="modernFlaggedFilterCount">0</span>
                    </button>
                </div>
            </div>

            <div class="table-container">
                <table class="tests-table">
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th class="right">Result</th>
                            <th>UOM</th>
                            <th class="center">Reference Range</th>
                            <th class="center">Flag</th>
                            <th class="center">Status</th>
                        </tr>
                    </thead>
                    <tbody id="modernTestsTableBody">
                    </tbody>
                </table>
                <div id="modernEmptyState" class="empty-state" style="display: none;">
                    <div class="empty-state-icon">📋</div>
                    <p>No tests found</p>
                </div>
            </div>

            <div class="summary-footer">
                <span id="modernDisplayInfo">Showing 0 of 0 tests</span>
                <span>Last updated: <span id="modernLastUpdate">--</span></span>
            </div>
        `;

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.filter;
                localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
                updateActiveFilterButton(currentFilter);
                renderModernTable();
            });
        });

        // Search input
        const searchInput = document.getElementById('modernSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value;
                renderModernTable();
            });
        }

        updateActiveFilterButton(currentFilter);
    }

    window.enhancedGrid.triggerSummaryUpdate = function() {
        allTestsData = getAllTests();
        allTestsData.sort((a, b) => {
            // *** PRIORITY 1: Sort by status - "Resulted" always on top ***
            const statusA = normalizeStatus(a.status);
            const statusB = normalizeStatus(b.status);

            if (statusA === 'resulted' && statusB !== 'resulted') {
                return -1;  // a comes first
            }
            if (statusA !== 'resulted' && statusB === 'resulted') {
                return 1;   // b comes first
            }

            // *** PRIORITY 2: Within same status, sort by test name ***
            const indexA = getSortIndex(a.name);
            const indexB = getSortIndex(b.name);
            if (indexA === indexB) {
                return a.originalIndex - b.originalIndex;
            }
            return indexA - indexB;
        });

        const counts = updateModernCounts();
        renderModernTable();
        updateModernTimestamp();
        updateActionableHeader(counts);
        syncHeaderColor(counts);
    };


    // ==========================================
    // SUMMARY CONTAINER INSERTION LOGIC
    // ==========================================

    const summaryContainer = document.createElement('div');
    summaryContainer.id = 'test-summary-container';

    let insertionIntervalId = null;
    // --- UPDATED: Relaxed URL Check for Summary Table ---
    // Matching the broader URL pattern used by the barcode feature to ensure consistency.
    const isTargetPageForSummary = () => /\/lab\/.*\/0\//.test(window.location.href);

    const removeSummaryContainer = () => {
        const container = document.getElementById(summaryContainer.id);
        if (container) {
            Object.assign(container.style, { position: '', top: '', zIndex: '' });
            container.remove();
        }
    };

    const attemptInsertion = () => {
        // --- UPDATED: Insertion Preference ---
        // 1. Try to attach after the barcode box (best case).
        // 2. Fallback to the sticky button group (if barcode box isn't there yet).
        // 3. Last resort: the test container.
        let targetElement = document.getElementById('barcode-display-box') ||
            document.querySelector('.btn-area.stickey-btnset') ||
            document.querySelector('.test-open.mt-2');

        if (!targetElement || document.getElementById(summaryContainer.id)) return false;

        targetElement.insertAdjacentElement('afterend', summaryContainer);

        // Apply initial sticky styles if possible
        updateSummaryPosition();

        initializeModernSummaryTable();
        return true;
    }

    // New function to dynamically update sticky position
    // This ensures that if the barcode box loads LATER, the summary table slides down correctly.
    function updateSummaryPosition() {
        const summaryContainer = document.getElementById('test-summary-container');
        const barcodeBox = document.getElementById('barcode-display-box');

        // If we have a barcode box, stick relative to IT.
        if (summaryContainer && barcodeBox) {
            try {
                const barcodeBoxStyles = window.getComputedStyle(barcodeBox);
                // Check if barcode box is sticky/fixed
                if (barcodeBoxStyles.position === 'sticky' || barcodeBoxStyles.position === 'fixed') {
                    const barcodeBoxHeight = barcodeBox.offsetHeight;
                    const barcodeBoxTop = parseInt(barcodeBoxStyles.top, 10) || 0;
                    const summaryTopPosition = barcodeBoxTop + barcodeBoxHeight; // Sit exactly underneath

                    if (summaryContainer.style.top !== `${summaryTopPosition}px`) {
                        Object.assign(summaryContainer.style, {
                            position: 'sticky',
                            top: `${summaryTopPosition}px`,
                            zIndex: '98',
                            marginLeft: 'auto', // Maintain right alignment if needed
                            marginRight: '0'
                        });
                    }
                }
            } catch (e) {
                console.error("Enhanced AG Grid: Error applying sticky style to summary container.", e);
            }
        }
        // Fallback: If no barcode box but we are sticky, maybe stick to top?
        // (Left as-is to avoid breaking other layouts)
    }

    const startInsertionPolling = () => {
        if (insertionIntervalId !== null) return;
        insertionIntervalId = setInterval(() => {
            if (attemptInsertion()) {
                clearInterval(insertionIntervalId);
                insertionIntervalId = null;
                if (window.enhancedGrid && window.enhancedGrid.triggerSummaryUpdate) {
                    window.enhancedGrid.triggerSummaryUpdate();
                }
            }
        }, 500);
    };

    const stopInsertionPolling = () => {
        if (insertionIntervalId !== null) {
            clearInterval(insertionIntervalId);
            insertionIntervalId = null;
        }
    };

    const manageSummaryTableLifecycle = () => {
        if (isTargetPageForSummary()) {
            startInsertionPolling();
        } else {
            stopInsertionPolling();
            removeSummaryContainer();
        }
    };

    manageSummaryTableLifecycle();

    // ==========================================
    // ORIGINAL FEATURES
    // ==========================================

    // --- Global Constants ---
    const GRID_WIDTH = '50vw';
    const RESIZED_FLAG = 'data-ag-resized';
    const INTERVAL = 300; // Main update interval
    const CLICKED_ROW_EXPIRY_PREFIX = 'clicked_row_expiry_';
    const CLICK_DURATION_MS = 60 * 1000;

    // --- Utility Functions ---
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // --- MRN Collection & Display Functions ---
    function extractMrnsFromContainer(profileContainer) {
        const mrns = {};
        const mid2Container = profileContainer.querySelector('.mid2');
        if (mid2Container) {
            const primaryMrnEl = mid2Container.querySelector('span.content[placement="left"]');
            const secondaryMrnEl = mid2Container.querySelector('span.content[placement="right"]');
            if (primaryMrnEl && secondaryMrnEl) {
                const babyMrn = primaryMrnEl.textContent.trim();
                const motherMrn = secondaryMrnEl.textContent.replace(/[\/ ]/g, '').trim();
                return ` Baby's MRN: ${babyMrn} |  Mother's MRN: ${motherMrn}`;
            }
        }
        const midDivs = profileContainer.querySelectorAll('.mid');
        midDivs.forEach(div => {
            const labelEl = div.querySelector('h6');
            const valueEl = div.querySelector('span');
            if (labelEl && valueEl) {
                const label = labelEl.textContent.trim().toUpperCase();
                const value = valueEl.textContent.trim();
                if (label.includes('MRN')) {
                    if (!mrns.patient && value) {
                        mrns.patient = value;
                    }
                    if (label.includes('M.MRN') && value) {
                        mrns.mother = value;
                    }
                }
            }
        });
        if (mrns.patient && mrns.mother) {
            return `Baby'MRN : ${mrns.patient} | Mother's MRN: ${mrns.mother}`;
        }
        if (mrns.patient) {
            return `MRN: ${mrns.patient}`;
        }
        return null;
    }

    function displayMrn() {
        const box = document.getElementById('barcode-display-box');
        if (!box) return;
        const profileContainer = document.querySelector('.patient-profile');
        if (!profileContainer) return;
        const mrnString = extractMrnsFromContainer(profileContainer);
        let mrnElement = document.getElementById('mrn-display');
        if (mrnString) {
            if (!mrnElement) {
                mrnElement = document.createElement('div');
                mrnElement.id = 'mrn-display';
                box.appendChild(mrnElement);
            }
            if (mrnElement.textContent !== mrnString) {
                mrnElement.textContent = mrnString;
            }
        } else if (mrnElement) {
            mrnElement.remove();
        }
    }

    // --- Patient Type Badge Logic ---
    function updatePatientTypeBadge() {
        const patientImgContainer = document.querySelector('.patient-img');
        if (!patientImgContainer) return;

        // Find Data
        const labelTd = document.querySelector('td[translateid="patient-detail.PatientType"]');
        if (!labelTd) return;

        const valueTd = labelTd.nextElementSibling;
        if (!valueTd) return;

        const patientType = valueTd.textContent.trim().toUpperCase();

        let badge = patientImgContainer.querySelector('.patient-type-badge');
        if (!badge) {
            badge = document.createElement('div');
            patientImgContainer.appendChild(badge);
        }

        // Update Badge
        if (patientType.includes('IN PATIENT') || patientType.includes('INPATIENT')) {
            badge.textContent = 'IN-PATIENT';
            badge.className = 'patient-type-badge in-patient';
            badge.title = 'In Patient';
        } else if (patientType.includes('OUT PATIENT') || patientType.includes('OUTPATIENT')) {
            badge.textContent = 'OUT-PATIENT';
            badge.className = 'patient-type-badge out-patient';
            badge.title = 'Out Patient';
        } else if (patientType.includes('EMERGENCY') || patientType === 'ER') {
            // FIX: Added 'ER' check to catch cases where the text is exactly 'ER'
            badge.textContent = 'ER';
            badge.className = 'patient-type-badge in-patient'; // Treat ER like In Patient for attention
            badge.style.backgroundColor = '#c0392b';
        } else {
            // Unknown or empty
            badge.remove();
        }
    }


    // --- Inject CSS Styles ---
    GM_addStyle(`
        /* --- LOCAL FONT AWESOME DEFINITION --- */
        @font-face {
            font-family: 'FontAwesome';
            font-style: normal;
            font-weight: 900;
            font-display: block;
            src: url(https://his.kaauh.org/lab/fontawesome-webfont.af7ae505a9eed503f8b8.woff2?v=4.7.0) format('woff2');
        }
        .fa, .fas {
            font-family: 'FontAwesome';
            font-weight: 900;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1;
        }
        .fa-check-circle:before { content: "\\f058"; }
        .fa-star:before { content: "\\f005"; }
        .fa-arrow-circle-up:before { content: "\\f0aa"; }
        .fa-arrow-circle-down:before { content: "\\f0ab"; }
        .fa-arrow-circle-right:before { content: "\\f0a9"; }

        /* --- General Layout & Resizing --- */
        .results .ag-theme-balham, .accd-details, .accd-details-table-static, .card-header {
            width: ${GRID_WIDTH} !important;
            margin-left: auto !important; margin-right: 0 !important; box-sizing: border-box;
        }
        .accd-details table, .accd-details-table-static table {
            width: 100% !important;
            table-layout: fixed !important; border-collapse: collapse !important;
        }
        .accd-details table th, .accd-details table td, .accd-details-table-static table th, .accd-details-table-static table td {
            padding: 8px !important;
            word-wrap: break-word !important;
        }
        .results .ag-theme-balham { height: auto; }
        /* --- AG-Grid Row and Cell Styles --- */
        .ag-row { transition: background-color 0.3s ease; }
        .ag-row.clicked-row-green .ag-cell { background-color: #A0ECA0 !important; }
        /* --- MRN Display Style --- */
        #mrn-display {
            font-size: 20px;
            font-weight: bold; color: #ffffff; background-color: #000000;
            padding: 4px 8px; border-radius: 4px; margin-left: 10px;
        }
    `);
    // --- AG-Grid Column Definitions ---
    const columnsToUncheck = [
        'Lab Order No', 'Hospital MRN', 'DOB', 'Test ID', 'National/Iqama Id', 'Department',
        'Doctor', 'Analyzer', 'Reference Lab', 'Accession No', 'Sequence No', 'Age',
        'Container Type', 'Storage Condition'
    ];
    let hasRunOnce = false;

    // --- AG-Grid Row Highlight Logic ---
    function handleRowClickForPersistentGreen(event) {
        const cellElement = event.target.closest('.ag-cell');
        if (!cellElement) return;
        const rowElement = cellElement.closest('.ag-row[role="row"]');
        if (!rowElement) return;
        const barcodeCell = rowElement.querySelector('div[col-id="barcode"]');
        if (!barcodeCell || !barcodeCell.textContent) return;
        const barcode = barcodeCell.textContent.trim();
        if (!barcode) return;
        const expiryTimestamp = Date.now() + CLICK_DURATION_MS;
        try {
            localStorage.setItem(CLICKED_ROW_EXPIRY_PREFIX + barcode, expiryTimestamp.toString());
        } catch (e) {
            console.error("Error saving to localStorage:", e);
        }
        applyPersistentRowStyles();
    }

    function applyPersistentRowStyles() {
        const rows = document.querySelectorAll('.ag-center-cols-container div[role="row"], .ag-pinned-left-cols-container div[role="row"], .ag-pinned-right-cols-container div[role="row"]');
        const now = Date.now();
        rows.forEach(row => {
            const barcodeCell = row.querySelector('div[col-id="barcode"]');
            let rowBarcode = barcodeCell?.textContent?.trim();
            if (rowBarcode) {
                const expiryKey = CLICKED_ROW_EXPIRY_PREFIX + rowBarcode;
                const expiryTimestampStr = localStorage.getItem(expiryKey);
                if (expiryTimestampStr) {
                    if (now < parseInt(expiryTimestampStr, 10)) row.classList.add('clicked-row-green');
                    else {
                        localStorage.removeItem(expiryKey);
                        row.classList.remove('clicked-row-green');
                    }
                } else row.classList.remove('clicked-row-green');
            } else row.classList.remove('clicked-row-green');
        });
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith(CLICKED_ROW_EXPIRY_PREFIX)) {
                    if (now >= parseInt(localStorage.getItem(key), 10)) localStorage.removeItem(key);
                }
            }
        } catch (e) {
            console.error("Error during localStorage cleanup:", e);
        }
    }

    function setupPersistentRowStylesListener() {
        const gridRoot = document.querySelector('.ag-root-wrapper');
        const listenerTarget = gridRoot || document.querySelector('.ag-body-viewport') || document.body;
        if (listenerTarget && !listenerTarget.dataset.persistentClickListenerAttached) {
            listenerTarget.addEventListener('click', handleRowClickForPersistentGreen, true);
            listenerTarget.dataset.persistentClickListenerAttached = 'true';
        }
    }

    // --- AG-Grid Column Visibility Logic ---
    function isSpecificPageForColumns() {
        return window.location.href.endsWith('/#/lab-orders/lab-test-analyzer');
    }
    function areColumnsChecked() {
        return columnsToUncheck.some(column => isColumnChecked(column));
    }
    function isColumnChecked(labelText) {
        for (const label of document.querySelectorAll('.ag-column-tool-panel-column-label')) {
            if (label.textContent.trim() === labelText && label.parentElement.querySelector('.ag-icon-checkbox-checked')) return true;
        }
        return false;
    }
    function ensureColumnsUnchecked() {
        if (hasRunOnce || !isSpecificPageForColumns() || !areColumnsChecked()) return;
        hasRunOnce = true;
        setTimeout(() => columnsToUncheck.forEach(clickColumnLabel), 1000);
    }
    function ensureOtherColumnsChecked() {
        if (!isSpecificPageForColumns()) return;
        document.querySelectorAll('.ag-column-tool-panel-column-label').forEach(label => {
            if (!columnsToUncheck.includes(label.textContent.trim()) && label.parentElement.querySelector('.ag-icon-checkbox-unchecked')) label.click();
        });
    }
    function clickColumnLabel(labelText) {
        if (!isSpecificPageForColumns()) return;
        document.querySelectorAll('.ag-column-tool-panel-column-label').forEach(label => {
            if (label.textContent.trim() === labelText && label.parentElement.querySelector('.ag-icon-checkbox-checked')) label.click();
        });
    }
    function initColumnToggle() {
        if (!isSpecificPageForColumns()) return;
        let attempts = 0;
        const interval = setInterval(() => {
            if (document.querySelector('.ag-side-buttons') || ++attempts > 10) {
                if (document.querySelector('.ag-side-buttons')) {
                    ensureColumnsUnchecked();
                    ensureOtherColumnsChecked();
                }
                clearInterval(interval);
            }
        }, 500);
    }

    // --- Layout and Main Update Orchestration ---
    const performLayoutAdjustments = () => {
        const actionButtonContainer = document.querySelector('div.lo-act-btn');
        if (actionButtonContainer && actionButtonContainer.parentElement) {
            actionButtonContainer.parentElement.removeAttribute('style');
        }
        document.querySelectorAll('ag-grid-angular').forEach(grid => {
            if (grid.getAttribute(RESIZED_FLAG)) return;
            const api = grid.agGrid?.api || grid.__agGridComp?.api;
            if (api && typeof api.sizeColumnsToFit === 'function') {
                grid.style.width = GRID_WIDTH;
                grid.style.marginLeft = 'auto';
                grid.style.marginRight = '0';
                api.sizeColumnsToFit();
                grid.setAttribute(RESIZED_FLAG, 'true');
            }
        });
        document.querySelectorAll('div.accd-details-table-static.test-open, .card-header').forEach(el => {
            el.style.width = GRID_WIDTH;
            el.style.marginLeft = 'auto';
            el.style.marginRight = '0';
        });
        document.querySelectorAll('h6[translateid="test-results.Results"]').forEach(el => el.remove());
    };

    const fullPageUpdate = debounce(() => {
        performLayoutAdjustments();
        applyPersistentRowStyles();
        setupPersistentRowStylesListener();
        displayMrn();
        updateSummaryPosition();
        updatePatientTypeBadge(); // --- NEW: Added patient badge update

        if (isSpecificPageForColumns()) {
            hasRunOnce = false;
            initColumnToggle();
        }
    }, 100);

    // --- Feature: Barcode Display Box (Fixed for New Layout) ---
    (function() {
        const BARCODE_KEY = 'selectedBarcode';
        let currentUrl = location.href;

        function loadJsBarcode(callback) {
            if (window.JsBarcode) {
                callback();
            } else {
                console.error("Unified Lab Assistant: JsBarcode library not found! Check the @require tag.");
            }
        }

        function insertBarcodeBox(barcode) {
            // Priority: The sticky button group provided by user
            const stickyBtnSet = document.querySelector('.btn-area.stickey-btnset');

            // Fallbacks
            let insertionTarget = document.querySelector('#custom-script-buttons') ||
                document.querySelector('.test-open.mt-2');

            // Safety check: prevent duplicates
            if (!barcode || document.getElementById('barcode-display-box')) return;

            // 2. Create the Box
            const box = document.createElement('div');
            box.id = 'barcode-display-box';
            // Updated CSS: Block layout to sit underneath, but flex content
            box.style.cssText = 'padding: 5px 10px; background:#ffffff; border-bottom: 1px solid #ccc; display:flex; align-items:center; gap:10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); width: 100%; z-index: 990;';

            const label = document.createElement('div');
            label.textContent = 'Barcode:';
            label.style.cssText = 'font-weight:bold; font-size:12px; color:#555; text-transform: uppercase;';

            const text = document.createElement('div');
            text.textContent = barcode;
            text.style.cssText = 'font-size: 18px; color: #000; font-weight: 800; font-family: monospace; letter-spacing: 1px;';

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.id = "barcode-svg";
            svg.style.cssText = 'height:30px; width:90px;';

            box.append(label, text, svg);

            // 3. Insert the box
            if (stickyBtnSet) {
                // *** FIX: Place underneath the sticky button group ***
                stickyBtnSet.insertAdjacentElement('afterend', box);
            } else if (insertionTarget) {
                insertionTarget.insertAdjacentElement('afterend', box);
            }

            // 4. Sticky/Positioning Logic
            if (stickyBtnSet) {
                try {
                    const headerStyle = window.getComputedStyle(stickyBtnSet);
                    if (headerStyle.position === 'sticky' || headerStyle.position === 'fixed') {
                        const headerHeight = stickyBtnSet.offsetHeight;
                        const headerTop = parseInt(headerStyle.top, 10) || 0;

                        Object.assign(box.style, {
                            position: 'sticky', // Stick it relative to its new position
                            top: `${headerTop + headerHeight}px`, // Offset by the button header height
                            left: '0',
                            zIndex: '999'
                        });
                    }
                } catch (e) {
                    console.error("Enhanced AG Grid: Error applying sticky style to barcode box.", e);
                }
            }

            // 5. Render Barcode
            loadJsBarcode(() => {
                if (typeof JsBarcode !== 'function') {
                    svg.outerHTML = "<span style='color:red; font-size:10px;'>Lib Error</span>";
                    return;
                }
                try {
                    JsBarcode(svg, barcode, {
                        format: "CODE128",
                        displayValue: false,
                        height: 30,
                        width: 2,
                        margin: 0,
                        background: "transparent"
                    });
                } catch (err) {
                    console.warn('Barcode render error:', err);
                    svg.outerHTML = "<span style='color:red; font-size:10px;'>Invalid</span>";
                }
            });

            if (typeof displayMrn === 'function') displayMrn();
        }

        function watchGridClicksForBarcodeBox() {
            document.body.addEventListener('click', e => {
                const cell = e.target.closest('.ag-row')?.querySelector('[col-id="barcode"]');
                if (cell?.textContent.trim()) {
                    localStorage.setItem(BARCODE_KEY, cell.textContent.trim());
                    // If box exists, update it immediately without reload
                    const existingText = document.querySelector('#barcode-display-box div:nth-child(2)');
                    if (existingText) {
                        const newBarcode = cell.textContent.trim();
                        existingText.textContent = newBarcode;
                        // Re-render svg
                        const svg = document.getElementById('barcode-svg');
                        if(svg && window.JsBarcode) {
                            JsBarcode(svg, newBarcode, { format: "CODE128", displayValue: false, height: 35, width: 2, margin: 0, background: "transparent" });
                        }
                    }
                }
            });
        }

        function waitAndShowBarcode() {
            const barcode = localStorage.getItem(BARCODE_KEY);

            // --- UPDATED URL CHECK: LESS STRICT ---
            // New: Checks if we are inside the lab module
            const urlPattern = /\/lab\/.*\/0\//;

            if (!barcode || !urlPattern.test(location.href)) return;

            // Increase attempts and check more frequently
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                // Look for the button set OR your custom buttons
                const ready = document.querySelector('.btn-area.stickey-btnset') ||
                    document.querySelector('#custom-script-buttons');

                if (ready) {
                    clearInterval(interval);
                    insertBarcodeBox(barcode);
                }

                // Stop trying after 10 seconds to save memory
                if (attempts > 30) clearInterval(interval);
            }, 300);
        }

        watchGridClicksForBarcodeBox();
        window.enhancedGrid.barcodeBoxUrlCheck = waitAndShowBarcode;
    })();


    // --- Feature: Dropdown Pagination ---
    (function() {
        const setDropdownValue = () => {
            const dropdown = document.getElementById("dropdownPaginationPageSize");
            if (dropdown && dropdown.value !== "100") {
                dropdown.value = "100";
                dropdown.dispatchEvent(new Event('change', {
                    bubbles: true
                }));
            }
        };
        new MutationObserver(setDropdownValue).observe(document.body, {
            childList: true,
            subtree: true
        });
        window.addEventListener('load', setDropdownValue);
    })();


    // --- Feature: Conditional Auto & Manual VERIFY2 ---
    (function() {
        const VERIFIED1_STATUS_TEXT = 'Verified 1';
        const RESULTED_STATUS_TEXT = 'Resulted';
        const STATUS_CELL_SELECTOR = 'div[col-id="ResultStatus"]';
        const VERIFY1_BUTTON_SELECTOR = 'button.verify1-btn';
        const VERIFY2_BUTTON_SELECTOR = 'button.verify2-btn';
        const HISTORY_BUTTON_SELECTOR = 'button.backBtn[translateid="edit-lab-order.HistoryResults"]';
        const VERIFICATION_MODAL_SELECTOR = '.modal-content';
        const CHECK_INTERVAL_MS = 200;
        let isAutoVerifyEnabled = true;
        let isVerificationProcessStarted = false;
        let hasAutoClicked = false;

        function clickVerifyButton() {
            const verifyButton = document.querySelector(VERIFY2_BUTTON_SELECTOR);
            if (verifyButton) {
                verifyButton.click();
            }
        }
        function hasResultedStatus() {
            const statusCells = document.querySelectorAll(STATUS_CELL_SELECTOR);
            for (const cell of statusCells) {
                if (cell.textContent && cell.textContent.trim().includes(RESULTED_STATUS_TEXT)) {
                    return true;
                }
            }
            return false;
        }
        function hasVerified1Status() {
            const statusCells = document.querySelectorAll(STATUS_CELL_SELECTOR);
            for (const cell of statusCells) {
                if (cell.textContent && cell.textContent.trim().includes(VERIFIED1_STATUS_TEXT)) {
                    return true;
                }
            }
            return false;
        }
        function isModalVisible() {
            const modal = document.querySelector(VERIFICATION_MODAL_SELECTOR);
            if (modal) {
                const modalTitle = modal.querySelector('h4.modal-title');
                if (modalTitle && modalTitle.textContent.trim() === 'Primary Verification') {
                    return true;
                }
            }
            return false;
        }
        function runSafetyChecks() {
            if (isModalVisible()) return false;
            if (hasResultedStatus()) return false;
            return true;
        }
        function checkAndAutoClick() {
            if (!isAutoVerifyEnabled || !isVerificationProcessStarted || hasAutoClicked) return;
            if (!runSafetyChecks()) return;
            if (hasVerified1Status()) {
                clickVerifyButton();
                hasAutoClicked = true;
            }
        }
        function injectAutoVerifyStyles() {
            const styleId = 'auto-verify-modern-styles';
            if (document.getElementById(styleId)) return;
            const styleSheet = document.createElement("style");
            styleSheet.id = styleId;
            styleSheet.innerText = `
                .auto-verify-toggle {
                    display: inline-flex;
                    align-items: center; gap: 12px; padding: 6px 10px;
                    border: 1px solid #ccc; border-radius: 20px; background-color: #f8f9fa;
                    cursor: pointer;
                    transition: all 0.3s ease; user-select: none;
                }
                .auto-verify-toggle.is-active {
                    border-color: #7ab5ff;
                    background-color: #e7f1ff; animation: pulse-glow 2s infinite;
                }
                .toggle-label {
                    font-size: 12px;
                    font-weight: 600; color: #333;
                    display: flex; align-items: center; gap: 6px;
                }
                .toggle-switch {
                    position: relative;
                    width: 40px; height: 22px;
                    background-color: #ccc; border-radius: 11px; transition: background-color 0.3s ease;
                }
                .auto-verify-toggle.is-active .toggle-switch { background-color: #007bff; }
                .toggle-thumb {
                    position: absolute;
                    top: 2px; left: 2px; width: 18px; height: 18px;
                    background-color: white; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                .auto-verify-toggle.is-active .toggle-thumb { transform: translateX(18px); }
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 0 0px rgba(0, 123, 255, 0.3); }
                    70% { box-shadow: 0 0 0 8px rgba(0, 123, 255, 0); }
                    100% { box-shadow: 0 0 0 0px rgba(0, 123, 255, 0); }
                }
            `;
            document.head.appendChild(styleSheet);
        }
        function updateVerifyUI() {
            const toggle = document.getElementById('autoVerifyToggleContainer');
            if (toggle) toggle.classList.toggle('is-active', isAutoVerifyEnabled);
            const verify2Button = document.querySelector(VERIFY2_BUTTON_SELECTOR);
            if (verify2Button) {
                if (!verify2Button.dataset.redesigned) {
                    verify2Button.textContent = 'VERIFY2 (F8)';
                    Object.assign(verify2Button.style, {
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '500', transition: 'border-color 0.3s ease'
                    });
                    verify2Button.dataset.redesigned = 'true';
                }
                verify2Button.style.borderColor = isAutoVerifyEnabled ?
                    '#007bff' : '';
            }
        }
        function redesignHistoryButton() {
            const historyButton = document.querySelector(HISTORY_BUTTON_SELECTOR);
            if (!historyButton || historyButton.dataset.redesigned) return;
            historyButton.innerHTML = `<span style="margin-right: 6px;">🕒</span> View History`;
            historyButton.title = "Click to view patient's full lab history";
            Object.assign(historyButton.style, {
                display: 'inline-flex', alignItems: 'center', fontWeight: '500'
            });
            historyButton.dataset.redesigned = 'true';
        }
        function injectModernToggle() {
            const historyButton = document.querySelector(HISTORY_BUTTON_SELECTOR);
            if (!historyButton || document.getElementById('autoVerifyToggleContainer')) return;
            const buttonParent = historyButton.parentElement;
            const toggleContainer = document.createElement('div');
            toggleContainer.id = 'autoVerifyToggleContainer';
            toggleContainer.className = 'auto-verify-toggle';
            toggleContainer.innerHTML = `
                <span class="toggle-label">
                    <span style="font-size: 14px;">🤖</span>
                    <span>AUTO VERIFY 2</span>
                </span>
                <div class="toggle-switch"><div class="toggle-thumb"></div></div>
            `;
            toggleContainer.addEventListener('click', () => {
                isAutoVerifyEnabled = !isAutoVerifyEnabled;
                updateVerifyUI();
            });
            Object.assign(toggleContainer.style, { marginRight: '15px', verticalAlign: 'middle' });
            buttonParent.insertBefore(toggleContainer, historyButton);
        }
        function handleKeyPress(event) {
            if (event.key === 'F8') {
                event.preventDefault();
                if (runSafetyChecks()) clickVerifyButton();
            }
        }
        function handlePageClick(event) {
            if (event.target.closest(VERIFY1_BUTTON_SELECTOR)) {
                isVerificationProcessStarted = true;
                hasAutoClicked = false;
            }
        }
        window.enhancedGrid.autoVerify = {
            init: () => {
                injectAutoVerifyStyles();
                setInterval(checkAndAutoClick, CHECK_INTERVAL_MS);
                document.addEventListener('keydown', handleKeyPress);
                document.addEventListener('click', handlePageClick);
            },
            updateUI: updateVerifyUI,
            redesignHistory: redesignHistoryButton,
            injectToggle: injectModernToggle,
            resetState: () => {
                hasAutoClicked = false;
                isVerificationProcessStarted = false;
            }
        };
    })();

    // --- Main Orchestrator ---
    let lastSummaryUpdate = 0;

    function runAllUpdates() {
        fullPageUpdate(); // Main layout and MRN updater

        const summaryContainer = document.getElementById('test-summary-container');
        if (summaryContainer) {
            // Wait for AG-Grid to be ready (either with rows or with "no rows" overlay)
            const gridReady = document.querySelector('.ag-center-cols-container .ag-row, .ag-overlay-no-rows-center');

            if (gridReady) {
                const now = Date.now();
                // Check if initial load needed OR if 5 seconds have passed for periodic update
                if (!window.enhancedGrid.summaryPopulated || (now - lastSummaryUpdate > 5000)) {
                    if (window.enhancedGrid.triggerSummaryUpdate) {
                        window.enhancedGrid.triggerSummaryUpdate();
                        lastSummaryUpdate = now;
                        window.enhancedGrid.summaryPopulated = true; // Ensure flag is set
                    }
                }
            }
        }

        if (window.enhancedGrid.autoVerify) {
            window.enhancedGrid.autoVerify.injectToggle();
            window.enhancedGrid.autoVerify.redesignHistory();
            window.enhancedGrid.autoVerify.updateUI();
        }
    }

    console.log('Unified Lab Assistant [v18.5] loaded.');
    window.enhancedGrid.autoVerify?.init();

    let lastUrl = location.href;
    const spaObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            window.enhancedGrid.summaryPopulated = false;
            document.querySelectorAll('ag-grid-angular').forEach(grid => grid.removeAttribute(RESIZED_FLAG));
            window.enhancedGrid.autoVerify?.resetState();
            console.log('[Lab Assistant] SPA Navigation Detected: Resetting states.');

            initializeScript();

            manageSummaryTableLifecycle();

            if (window.enhancedGrid.barcodeBoxUrlCheck) {
                window.enhancedGrid.barcodeBoxUrlCheck();
            }
        }
        debounce(runAllUpdates, 200)();
    });
    spaObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run all updates on a regular interval as a fallback
    setInterval(runAllUpdates, INTERVAL);

    // Initial run after a short delay
    setTimeout(() => {
        runAllUpdates();
        initializeScript();

        if (window.enhancedGrid.barcodeBoxUrlCheck) {
            window.enhancedGrid.barcodeBoxUrlCheck();
        }
    }, 500);


})();


// ============================================
// TELEPHONE EXTENSION FEATURE - v17.0.4 (Unified Chip)
// ============================================
(function() {
    'use strict';

    // Extension Map for Hospital Wards - Ordered by specificity
    const WARD_EXTENSIONS = {
        // Cardiac Care (check CC variations first)
        'CARDIAC CARE CENTER': ['12600', '11648'], // Original spelling
        'CARDIAC CARE UNIT': ['12600', '11648'],
        'CARDIAC CENTER': ['12600', '11648'],
        'CARDIC CENTRE': ['12600', '11648'],
        'CARDIC CARE CENTER': ['12600', '11648'],
        'CCU': ['12600', '11648'],
        'CC': ['12600', '11648'],

        // Medical/Surgical Units (check full names first)
        'FEMALE MEDICAL UNIT': ['13114'],
        'FEMALE MEDICAL': ['13114'],
        'FM': ['13114'],

        'MALE MEDICAL UNIT': ['13014', '13774', '13616'],
        'MALE MEDICAL': ['13014', '13774', '13616'],
        'MM': ['13014', '13774', '13616'],

        'MALE SURGICAL UNIT': ['15613', '15600', '15007', '15614', '15615'],
        'MALE SURGICAL': ['15613', '15600', '15007', '15614', '15615'],
        'MS': ['15613', '15600', '15007', '15614', '15615'],

        'FEMALE SURGICAL UNIT': ['15113', '15114', '15115'],
        'FEMALE SURGICAL': ['15113', '15114', '15115'],
        'FS': ['15113', '15114', '15115'],

        // Labor & Delivery
        'LABOR AND DELIVERY': ['11722', '11723'],
        'LABOR & DELIVERY': ['11722', '11723'],
        'L & D': ['11722', '11723'],
        'L&D': ['11722', '11723'],

        // Day Care Units
        'DAY CARE UNIT ONCOLOGY HEMATOLOGY': ['14107', '14116', '14106', '14310'],
        'DCUOH': ['14107', '14116', '14106', '14310'],
        'DAY CARE UNIT': ['14107', '14116', '14106', '14310'],
        'DCU': ['14107', '14116', '14106', '14310'],

        // Dialysis
        'DIALYSIS': ['10319', '12146', '12401'],

        // Management
        'DUTY MANAGER': ['17179'],

        // Endoscopy
        'ENDOSCOPY': ['10228', '10221'],
        'ENDO': ['10228', '10221'],

        // Emergency
        'EMERGENCY ROOM UNIT': ['10999', '18331', '10342', '10552', '10415', '10557', '10435'],
        'Emergency Department (ED)': ['10999', '18331', '10342', '10552', '10415', '10557', '10435'],
        'EMERGENCY ROOM': ['10999', '18331', '10342', '10552', '10415', '10557', '10435'],
        'ER UNIT': ['10999', '18331', '10342', '10552', '10415', '10557', '10435'],
        'ER': ['10999', '18331', '10342', '10552', '10415', '10557', '10435'],
        'ED': ['10999', '18331', '10342', '10552', '10415', '10557', '10435'],

        // Hematology
        'HEMATOLOGY CLINIC': ['11411', '11410'],
        'HEMA CLINIC': ['11411', '11410'],

        // IDIA
        'INFECTIOUS DISEASE ISOLATION': ['12401', '12402'],
        'IDIA': ['12401', '12402'],

        // IOH
        'INPATIENT ONC.HEMA.': ['10652', '10360'],
        'INSTITUTE OF OPHTHALMOLOGY': ['10652', '10360'],
        'IOH IN': ['10652', '10360'],
        'IOH': ['10652', '10360'],

        // Isolation
        'ISOLATION UNIT': ['14302', '14303'],
        'ISOLATION': ['14302', '14303'],
        'ISO': ['14302', '14303'],

        // ICU Units
        'MEDICAL INTENSIVE CARE UNIT': ['12807', '12802', '12801'],
        'MICU': ['12807', '12802', '12801'],

        'SURGICAL INTENSIVE CARE UNIT': ['10258', '10288', '10277', '18422'],
        'SICU': ['10258', '10288', '10277', '18422'],

        'NEONATAL INTENSIVE CARE UNIT': ['11840'],
        'NICU': ['11840'],

        'PEDIATRIC CARDIAC INTENSIVE CARE UNIT': ['10547', '10549'],
        'PEDIATRIC CARDIAC ICU': ['10547', '10549'],
        'PCICU': ['10547', '10549'],

        'PEDIATRIC INTENSIVE CARE UNIT 2': ['13352', '13355'],
        'PICU 2': ['13352', '13355'],

        'PEDIATRIC INTENSIVE CARE UNIT': ['12814', '12815'],
        'PICU': ['12814', '12815'],

        'SURGICAL INTERMEDIATE CARE UNIT': ['15115'],
        'SIMCU': ['15115'],

        // Nursery & OB
        'NEWBORN NURSERY': ['11220', '11767', '11724'],
        'NURSERY': ['11220', '11767', '11724'],
        'NN': ['11220', '11767', '11724'],

        'OBSTETRICS': ['11734', '11114', '11116'],
        'OB': ['11734', '11114', '11116'],

        // Pediatric Units
        'PEDIATRIC DAY CARE UNIT': ['11764'],
        'PED DAY CARE': ['11764'],
        'DAY CARE (PEDIATRIC UNIT)': ['11764'],


        'PEDIATRIC EMERGENCY ROOM': ['10412'],
        'PEDIATRIC ER': ['10412'],
        'PED ER': ['10412'],

        'PEDIATRIC HEMATOLOGY ONCOLOGY': ['12615'],
        'PED HEMA ONC': ['12615'],

        // Post Medical
        'POST MEDICAL 1': ['11613', '17164', '11612', '10288', '11761'],
        'PM 1': ['11613', '17164', '11612', '10288', '11761'],
        'PEDIATRIC UNIT 1': ['11613', '17164', '11612', '10288', '11761'],

        'POST MEDICAL 2': ['12616', '12618', '12605'],
        'PM 2': ['12616', '12618', '12605'],
        'PEDIATRIC UNIT 2': ['12616', '12618', '12605'],

        // Private
        'PRIVATE WARD 1': ['11763', '12012', '12011', '12015'],
        'PRIVATE': ['11763', '12012', '12011', '12015'],
        'PVT1': ['11763', '12012', '12011', '12015'],

        // Other
        'PATIENT CARE SUPPORT SERVICES': ['10538'],
        'PCSS': ['10538'],

        'STAFF HEALTH SERVICES': ['10016', '10017'],
        'STAFF HEALTH': ['10016', '10017'],

        'STAT LABORATORY': ['10427'],
        'STAT LAB': ['10427']
    };

    // Function to find extension numbers for a location
    function getExtensionsForLocation(location) {
        if (!location) return null;
        const locationUpper = location.toUpperCase().trim();
        let mainLocation = locationUpper;
        if (locationUpper.includes('/')) {
            mainLocation = locationUpper.split('/')[0].trim();
        }
        const abbrevMatch = mainLocation.match(/\(([^)]+)\)/);
        if (abbrevMatch) {
            const abbrev = abbrevMatch[1].trim();
            if (WARD_EXTENSIONS[abbrev]) {
                return WARD_EXTENSIONS[abbrev];
            }
        }
        if (WARD_EXTENSIONS[mainLocation]) {
            return WARD_EXTENSIONS[mainLocation];
        }
        if (WARD_EXTENSIONS[locationUpper]) {
            return WARD_EXTENSIONS[locationUpper];
        }
        const sortedKeys = Object.keys(WARD_EXTENSIONS).sort((a, b) => b.length - a.length);
        for (const ward of sortedKeys) {
            if (mainLocation.includes(ward)) {
                return WARD_EXTENSIONS[ward];
            }
        }
        return null;
    }

    // Function to create the new "Unified Chip"
    function createUnifiedChip(locationText, extensions) {
        if (!extensions || extensions.length === 0) return null;
        if (!locationText) locationText = "Location"; // Fallback

        const extensionList = extensions.join(', ');

        const chip = document.createElement('span');
        chip.className = 'location-telephone-chip';
        chip.innerHTML = `
        <span class="loc-text">${locationText}</span>
        <span class="loc-tel" title="Extension(s): ${extensionList}">
            <span class="tel-numbers">${extensionList}</span>
        </span>
    `;

        return chip;
    }


    // Add CSS for telephone display
    GM_addStyle(`
    /* ============================================
        MODERN UNIFIED CHIP DESIGN - Enhanced v17.9.2
        16px fonts, softer 12px corners, no hover effects
        ============================================ */

    @keyframes chipFadeIn {
        from {
            opacity: 0;
            transform: translateY(-4px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* Main chip container with gradient and modern effects */
    .location-telephone-chip {
        display: inline-flex;
        align-items: center;
        border-radius: 12px;
        overflow: hidden;
        font-size: 16px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25), 0 1px 3px rgba(0, 0, 0, 0.12);
        animation: chipFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        border: 1px solid rgba(0, 123, 255, 0.2);
        cursor: default;
        position: relative;
    }

    /* Location part - vibrant gradient background */
    .loc-text {
        padding: 8px 16px;
        font-size: 16px;
        background: linear-gradient(135deg, #0062cc 0%, #004a99 50%, #003875 100%);
        color: #ffffff;
        white-space: nowrap;
        font-weight: 700;
        letter-spacing: 0.3px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        position: relative;
    }

    /* Telephone part - modern clean design with icon */
    .loc-tel {
        display: inline-flex;
        font-size: 16px;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        color: #2c3e50;
        border-left: 2px solid rgba(0, 123, 255, 0.3);
        white-space: nowrap;
        font-weight: 600;
        position: relative;
    }

    /* Add phone icon before telephone numbers */
    .loc-tel::before {
        content: '☎';
        font-size: 16px;
        color: #007bff;
        filter: drop-shadow(0 1px 2px rgba(0, 123, 255, 0.3));
    }

    /* Telephone numbers styling - more prominent */
    .tel-numbers {
        font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
        font-weight: 700;
        font-size: 16px;
        color: #1a1a1a;
        letter-spacing: 0.5px;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
    }

    /* Responsive sizing for smaller screens */
    @media (max-width: 768px) {
        .location-telephone-chip {
            font-size: 14px;
        }

        .loc-text, .loc-tel {
            padding: 6px 12px;
            font-size: 14px;
        }

        .tel-numbers {
            font-size: 14px;
        }

        .loc-tel::before {
            font-size: 14px;
        }
    }
`);

    // ============================================
    // START: SCRIPT FIX v17.0.1 (MODIFIED for Chip)
    // ============================================

    // This function now replaces the original pill with the new chip.
    function enhanceLocationWithTelephone(locationElement) {
        if (!locationElement) return;

        // Get only the base text, ignoring our icon span
        let locationText = "";
        locationElement.childNodes.forEach(node => {
            // Node.TEXT_NODE = 3. We only want to read the plain text.
            if (node.nodeType === 3) {
                locationText += node.textContent;
            }
        });
        locationText = locationText.trim();

        // If no text, or if text is the same as last time, exit.
        if (!locationText || locationElement.dataset.processedLocation === locationText) {
            return;
        }

        // Mark with the new text we are processing
        locationElement.dataset.processedLocation = locationText;

        const extensions = getExtensionsForLocation(locationText);

        // Remove old icon/chip if one exists
        const existingIcon = locationElement.querySelector('.location-telephone');
        if (existingIcon) existingIcon.remove();
        const existingChip = locationElement.querySelector('.location-telephone-chip');
        if (existingChip) existingChip.remove();


        // *** NEW UNIFIED CHIP LOGIC ***
        if (extensions) {

            // 1. Remove all text nodes from the original element
            locationElement.childNodes.forEach(node => {
                if (node.nodeType === 3) {
                    node.remove();
                }
            });

            // 2. Neutralize the original container's styling
            // (This stops the old blue pill from wrapping our new chip)
            locationElement.style.cssText = `
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            box-shadow: none;
            display: inline-block;
        `;

            // 3. Create and append the new chip
            const telChip = createUnifiedChip(locationText, extensions);
            if (telChip) {
                locationElement.appendChild(telChip);
            }
        }
        // If no extensions are found, we do nothing, and the original location text/pill remains.
    }

    // **FIX 2:** This observer is much more efficient.
    function observeLocationElements() {
        const LOCATION_SELECTORS = '[col-id*="location"], [col-id*="Location"], .patient-location, .test-location, #suite-location-display';

        // Function to process a node and its children for location cells
        const processNode = (node) => {
            if (node.nodeType !== 1) return; // Not an element

            // Check if the node itself is a location cell
            if (node.matches(LOCATION_SELECTORS)) {
                enhanceLocationWithTelephone(node);
            }

            // Check if the node *contains* location cells
            if (node.querySelectorAll) {
                node.querySelectorAll(LOCATION_SELECTORS).forEach(enhanceLocationWithTelephone);
            }
        };

        const observer = new MutationObserver((mutations) => {
            // Use requestAnimationFrame to batch processing and avoid layout thrashing
            window.requestAnimationFrame(() => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        processNode(node);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true, // Only watch for added/removed nodes
            subtree: true
        });

        // **FIX 3:** Removed setInterval/setTimeout loops.
        // We just run it *once* after a delay to catch elements already on the page.
        setTimeout(() => {
            document.querySelectorAll(LOCATION_SELECTORS).forEach(enhanceLocationWithTelephone);
        }, 1500);
    }

    // ============================================
    // END: SCRIPT FIX
    // ============================================

    // Initialize
    (function() {
        console.log('📞 Telephone Extension Feature v17.0.4 (Unified Chip) - LOADED');
        console.log('✅ Smart matching enabled: Abbreviations, Full names, Parentheses detection');
        observeLocationElements();
    })();

})();