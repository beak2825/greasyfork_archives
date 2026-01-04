// ==UserScript==
// @name         TC Rental Cost Calculator
// @namespace    http://tampermonkey.net/
// @version      2.2 // Side panel, top
// @description  Compares rental property offers, filters by happiness, and highlights the most cash-efficient daily costs.
// @author       Rusty Dan 78
// @match        https://www.torn.com/properties.php?step=rentalmarket*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552406/TC%20Rental%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/552406/TC%20Rental%20Cost%20Calculator.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';

    // --- Configuration and State ---
    const MIN_HAPPINESS_KEY = 'torn_rental_min_happiness';
    let MIN_HAPPINESS = GM_getValue(MIN_HAPPINESS_KEY, 3600);
    let currentPageDailyCosts = new Map();
    // Renaming panel IDs from 'optimizer' to 'calculator'
    const PANEL_ID = 'tm-rental-calculator-panel';
    const PANEL_WRAPPER_ID = 'tm-panel-wrapper';
    const PANEL_HEADER_ID = 'tm-panel-header';
    const INFO_DIV_ID = 'tm-daily-cost-info';

    // --- Selectors for Torn Property List Data ---
    const SEL_HAPPINESS = '.happiness';
    const SEL_INITIAL_PAYMENT = '.cost';
    const SEL_DAILY_PAYMENT = '.cost-per-day';
    const SEL_LEASE_TIME = '.rental-period';

    // --- Utility Functions ---

    /**
     * Parses a Torn City currency string (e.g., "$12,345") into a raw number.
     * @param {string} currencyStr - The string to parse.
     * @returns {number} The parsed numerical value.
     */
    function parseTornMoney(currencyStr) {
        if (!currencyStr) return 0;
        // Remove commas, dollar signs, and convert to float
        return parseFloat(currencyStr.replace(/[^0-9.]/g, ''));
    }

    /**
     * Finds the parent container for the rental market list.
     * @returns {jQuery|null} The main list container element or null.
     */
    function getRentalListContainer() {
        return $('ul.rental').first();
    }

    /**
     * Calculates the true daily cost of an offer.
     * @returns {number} The cash-efficient daily cost.
     */
    function calculateDailyCost(initial, daily, leaseTime) {
        if (leaseTime <= 0) return Infinity;
        const totalCost = initial + (daily * leaseTime);
        return totalCost / leaseTime;
    }

    // --- UI Setup ---

    /**
     * Custom CSS for the static control panel and highlighting, tailored for sidebar integration.
     */
    function injectStyles() {
        GM_addStyle(`
            /* --- Sidebar Integration Styles --- */
            #${PANEL_ID} {
                /* Mimic the area-desktop container */
                width: 100%;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                /* Use a high z-index to ensure it sits above other elements if needed */
                z-index: 999;
            }

            /* Custom internal wrapper to mimic area-row styling */
            #${PANEL_WRAPPER_ID} {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                padding: 8px 10px; /* Consistent padding with Torn menu items */
                background-color: #292929; /* Slightly darker background for the module */
                border-bottom: 1px solid #333; /* Separator line */
            }

            #${PANEL_HEADER_ID} {
                font-weight: bold;
                margin-bottom: 5px;
                color: #fff;
                font-size: 14px;
            }

            #tm-min-happiness-label {
                font-size: 11px;
                margin-bottom: 3px;
                color: #aaa;
                font-weight: 400;
            }

            #tm-min-happiness-input {
                width: 100%;
                padding: 3px 5px;
                border-radius: 3px;
                border: 1px solid #555;
                background-color: #1a1a1a;
                color: #fff;
                margin-bottom: 5px;
                font-size: 12px;
                box-sizing: border-box;
                height: 24px;
            }

            #tm-recalculate-btn {
                width: 100%;
                padding: 4px;
                background-color: #f7a01d; /* Torn orange */
                color: #111;
                border: none;
                border-radius: 3px;
                font-weight: bold;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s ease;
                margin-bottom: 5px;
            }

            #tm-recalculate-btn:hover {
                background-color: #e5941a;
            }

            #${INFO_DIV_ID} {
                font-size: 11px;
                margin-top: 5px;
                padding-top: 5px;
                border-top: 1px solid #3a3a3a;
                color: #79d279; /* Light green for good value */
            }

            /* --- Highlighting and Tooltip Styles (Same as before) --- */
            .tm-highlight-best {
                background-color: rgba(0, 150, 0, 0.2) !important;
                border-left: 5px solid #00c853 !important;
                transition: background-color 0.3s ease;
            }
            .tm-highlight-best:hover {
                 background-color: rgba(0, 150, 0, 0.3) !important;
            }

            li:hover .tm-daily-cost-tooltip {
                visibility: visible;
                opacity: 1;
            }
            .tm-daily-cost-tooltip {
                visibility: hidden;
                width: 180px;
                background-color: #555;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px 0;
                position: absolute;
                z-index: 10000;
                bottom: 125%;
                left: 50%;
                margin-left: -90px;
                opacity: 0;
                transition: opacity 0.3s;
                font-size: 12px;
            }
            .tm-daily-cost-tooltip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: #555 transparent transparent transparent;
            }
        `);
    }

    /**
     * Creates and prepends the static control panel to the standard side menu area.
     */
    function createControlPanel() {
        // Target the main navigation wrapper provided by the user
        const $sidebarContainer = $('.toggle-content___BJ9Q9').first();

        if ($sidebarContainer.length === 0) {
            console.error("TC Rental Cost Calculator: Could not find sidebar container (.toggle-content___BJ9Q9).");
            return;
        }

        const panelHtml = `
            <div id="${PANEL_ID}" class="area-desktop___bpqAS">
                <div id="${PANEL_WRAPPER_ID}">
                    <div id="${PANEL_HEADER_ID}">Rental Cost Calculator</div>
                    <label id="tm-min-happiness-label" for="tm-min-happiness-input">Min Happiness Threshold:</label>
                    <input type="number" id="tm-min-happiness-input" value="${MIN_HAPPINESS}" min="0">
                    <button id="tm-recalculate-btn">Calculate Offers</button>
                    <div id="${INFO_DIV_ID}">
                        Click 'Calculate Offers' to begin.
                    </div>
                </div>
            </div>
        `;

        // Prepend the panel to the identified sidebar container
        $sidebarContainer.prepend(panelHtml);

        // --- Event Handlers ---
        // Input handler
        $('#tm-min-happiness-input').on('change', function() {
            const newMinHappiness = parseInt($(this).val(), 10);
            if (!isNaN(newMinHappiness) && newMinHappiness >= 0) {
                MIN_HAPPINESS = newMinHappiness;
                GM_setValue(MIN_HAPPINESS_KEY, MIN_HAPPINESS);
                // No automatic recalculation, only save new value
                $(`#${INFO_DIV_ID}`).html(`Threshold saved. Click 'Calculate Offers'.`);
            } else {
                $(this).val(MIN_HAPPINESS); // Revert on invalid input
            }
        }).on('keyup', function(e) {
            if (e.key === 'Enter') {
                $(this).trigger('change');
            }
        });

        // Manual recalculate button handler
        $('#tm-recalculate-btn').on('click', function() {
            processRentals();
        });
    }

    // --- Main Logic ---

    /**
     * Parses the data from a single property row element.
     */
    function parseRowData($row) {
        // Find elements using the correct selectors
        const $happinessDiv = $row.find(SEL_HAPPINESS);
        const $initialDiv = $row.find(SEL_INITIAL_PAYMENT);
        const $dailyDiv = $row.find(SEL_DAILY_PAYMENT);
        const $leaseDiv = $row.find(SEL_LEASE_TIME);

        // Raw Text Extraction
        const happinessRawText = $happinessDiv.text().trim();
        const initialRawText = $initialDiv.text().trim();
        const dailyText = $dailyDiv.text().trim();
        const leaseRawText = $leaseDiv.text().trim();

        // Parsing and Cleaning
        const happinessMatch = happinessRawText.match(/(\d+)(?!.*\d)/);
        const happiness = happinessMatch ? parseInt(happinessMatch[1], 10) : 0;

        const initialPaymentMatch = initialRawText.match(/(\$[\d,.]+)(?!.*\$)/);
        const initialText = initialPaymentMatch ? initialPaymentMatch[1] : '';

        const leaseTimeMatch = leaseRawText.match(/(\d+)(?!.*\d)/);
        const leaseTime = leaseTimeMatch ? parseInt(leaseTimeMatch[1], 10) : 0;

        // Final Numerical Conversion
        const initialPayment = parseTornMoney(initialText);
        const dailyPayment = parseTornMoney(dailyText);

        if (isNaN(happiness) || isNaN(initialPayment) || isNaN(dailyPayment) || leaseTime <= 0) {
            return null;
        }

        return { happiness, initialPayment, dailyPayment, leaseTime };
    }

    /**
     * The main function to analyze all rentals, find the best deal, and update the UI.
     */
    function processRentals() {
        const $listContainer = getRentalListContainer();

        if (!$listContainer || $listContainer.length === 0) {
            $(`#${INFO_DIV_ID}`).html('Error: Rental list container not found.');
            return;
        }

        // Show loading state
        $(`#${INFO_DIV_ID}`).html('<span style="color: #f7a01d;">Calculating...</span>');

        const $rows = $listContainer.find('> li');
        let bestDailyCost = Infinity;
        let filteredOffers = [];
        currentPageDailyCosts.clear();

        if ($rows.length === 0) {
            $(`#${INFO_DIV_ID}`).html(`No rental offers visible.`);
            return;
        }

        // First Pass: Calculate and Filter
        $rows.each(function() {
            const $row = $(this);
            $row.removeClass('tm-highlight-best'); // Clear previous highlights

            const data = parseRowData($row);
            if (!data) return;

            const dailyCost = calculateDailyCost(data.initialPayment, data.dailyPayment, data.leaseTime);
            currentPageDailyCosts.set($row[0], dailyCost);

            $row.find('.tm-daily-cost-tooltip').remove();

            // 1. Filter by Happiness
            if (data.happiness >= MIN_HAPPINESS) {
                filteredOffers.push({ $row, dailyCost });
                bestDailyCost = Math.min(bestDailyCost, dailyCost);

                // 2. Add Tooltip
                const formattedCost = dailyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
                const tooltipHtml = `<span class="tm-daily-cost-tooltip">Calculated Daily Cost: ${formattedCost}</span>`;
                $row.css('position', 'relative').append(tooltipHtml);

                // 3. Add Hover Listener to update the sidebar info
                $row.off('mouseenter.tm').on('mouseenter.tm', function() {
                    $(`#${INFO_DIV_ID}`).html(`
                        <div style="color: #aaa;">Hover Cost:</div>
                        <div style="font-weight: bold; color: #79d279;">${formattedCost}</div>
                    `);
                });
                $row.off('mouseleave.tm').on('mouseleave.tm', function() {
                     // Revert to showing the best deal found
                     updatePanelBestCost(bestDailyCost);
                });
            }
        });

        // Second Pass: Highlight the best offers
        const TOLERANCE = 0.0001;
        if (filteredOffers.length > 0 && bestDailyCost !== Infinity) {
            filteredOffers.forEach(offer => {
                if (Math.abs(offer.dailyCost - bestDailyCost) < TOLERANCE) {
                    offer.$row.addClass('tm-highlight-best');
                }
            });
            // Update the static sidebar panel
             updatePanelBestCost(bestDailyCost);
        } else {
            $(`#${INFO_DIV_ID}`).html(`No offers found above ${MIN_HAPPINESS} Happiness.`);
        }
    }

    /**
     * Updates the best cost display in the sidebar panel.
     */
    function updatePanelBestCost(cost) {
        if (cost !== Infinity) {
             const formattedBestCost = cost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
             $(`#${INFO_DIV_ID}`).html(`
                <div style="color: #aaa;">Best Deal (>${MIN_HAPPINESS} Happy):</div>
                <div style="font-weight: bold; color: #79d279;">${formattedBestCost}</div>
             `);
        } else {
            $(`#${INFO_DIV_ID}`).html(`No deals found (Min Happy: ${MIN_HAPPINESS}).`);
        }
    }

    // --- Initialization ---

    /**
     * Initializes the script by injecting styles and creating the UI.
     */
    function init() {
        injectStyles();
        createControlPanel();
    }

    // Start the script
    $(document).ready(init);

})();
