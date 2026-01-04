// ==UserScript==
// @name         enhanced linkdb
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.1
// @description  Fügt einen such.pl-Button hinzu, um zu den Artikel-IDs zu gelangen (z.B. für Artikel-Ersetzer)
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/kalif/artikel/link*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         http://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/554878/enhanced%20linkdb.user.js
// @updateURL https://update.greasyfork.org/scripts/554878/enhanced%20linkdb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initSuchPlButton() {
        // Find the table header with the checkbox
        const tableHead = document.querySelector('.ft__head');
        if (!tableHead) return;

        const firstHeaderCell = tableHead.querySelector('th.ft__head__cell.text-center');
        if (!firstHeaderCell) return;

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            margin-top: 12px;
        `;

        // Create the button
        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'such-pl-button';
        button.textContent = 'such.pl';
        button.style.cssText = `
            padding: 6px 12px;
            background-color: #0d6efd;
            color: white;
            border: 1px solid #0d6efd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        `;

        // Store original styles for disabled state
        const enabledBgColor = '#0d6efd';
        const disabledBgColor = '#6c757d';

        // Create warning text element
        const warningText = document.createElement('span');
        warningText.id = 'such-pl-warning';
        warningText.textContent = "Bitte 'ID'-Spalte aktivieren";
        warningText.style.cssText = `
            color: #dc3545;
            font-size: 14px;
            font-weight: 500;
            display: none;
        `;

        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.id = 'such-pl-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background-color: #333;
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            z-index: 10000;
            display: none;
            margin-top: 8px;
        `;
        document.body.appendChild(tooltip);

        // Function to check if ID column is enabled
        function isIdColumnEnabled() {
            const headerCells = document.querySelectorAll('.ft__head th');
            for (const cell of headerCells) {
                const text = cell.textContent.trim();
                if (text === 'ID') {
                    return true;
                }
            }
            return false;
        }

        // Function to get all IDs from the current table
        function getAllIds() {
            const idCells = document.querySelectorAll('td[id^="id-"]');
            const ids = [];
            idCells.forEach(cell => {
                const id = cell.textContent.trim();
                if (id) ids.push(id);
            });
            return ids;
        }

        // Function to parse counter values
        function getCounterValues() {
            // Try to find both counter locations (header and footer)
            const counterWrappers = document.querySelectorAll('.selected__marker__wrapper');
            if (counterWrappers.length === 0) return { loaded: 0, total: 0 };

            // Prefer the footer counter (with fixed-bottom), but use either
            let targetWrapper = null;
            for (let wrapper of counterWrappers) {
                targetWrapper = wrapper;
                // Check if this is the footer one (inside fixed-bottom nav)
                if (wrapper.closest('nav.fixed-bottom')) {
                    break;
                }
            }

            if (!targetWrapper) return { loaded: 0, total: 0 };

            // Find all spans and extract numeric values
            const spans = targetWrapper.querySelectorAll('span');
            const numericSpans = [];

            for (let span of spans) {
                const text = span.textContent.trim();
                const num = parseInt(text);
                if (!isNaN(num)) {
                    numericSpans.push(num);
                }
            }

            // We should have at least 2 numeric values: loaded and total
            if (numericSpans.length >= 2) {
                const loaded = numericSpans[0];
                const total = numericSpans[numericSpans.length - 1]; // Last number is total
                return { loaded, total };
            }

            return { loaded: 0, total: 0 };
        }

        // Function to update button state
        function updateButtonState() {
            const idColumnEnabled = isIdColumnEnabled();
            const ids = getAllIds();
            const { loaded, total } = getCounterValues();
            const allLoaded = loaded === total && total > 0;

            // Show/hide warning text based on ID column status
            warningText.style.display = idColumnEnabled ? 'none' : 'inline';

            // Button is disabled if ID column is not enabled OR no IDs OR not all loaded
            const isDisabled = !idColumnEnabled || ids.length === 0 || !allLoaded;

            if (isDisabled) {
                button.disabled = true;
                button.style.backgroundColor = disabledBgColor;
                button.style.borderColor = disabledBgColor;
                button.style.cursor = 'not-allowed';
                button.style.opacity = '0.6';

                // Set tooltip message
                let tooltipMsg = '';
                if (!idColumnEnabled) {
                    tooltipMsg = 'keine Datensätze geladen';
                } else if (ids.length === 0) {
                    tooltipMsg = 'keine Datensätze geladen';
                } else if (!allLoaded) {
                    tooltipMsg = `nicht alle Datensätze geladen (${loaded} / ${total})`;
                }

                button.title = tooltipMsg;
            } else {
                button.disabled = false;
                button.style.backgroundColor = enabledBgColor;
                button.style.borderColor = enabledBgColor;
                button.style.cursor = 'pointer';
                button.style.opacity = '1';
                button.title = '';
            }
        }

        // Add hover effects for disabled button
        button.addEventListener('mouseenter', function() {
            if (this.disabled) {
                const rect = this.getBoundingClientRect();
                tooltip.textContent = this.title;
                tooltip.style.display = 'block';
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.bottom + 5) + 'px';
            }
        });

        button.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });

        // Add hover effect for enabled button
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.backgroundColor = '#0b5ed7';
                this.style.borderColor = '#0b5ed7';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (!this.disabled) {
                this.style.backgroundColor = enabledBgColor;
                this.style.borderColor = enabledBgColor;
            }
        });

        // Click handler
        button.addEventListener('click', function() {
            if (this.disabled) return;

            const ids = getAllIds();
            const idString = ids.join(',');
            const url = `https://opus.geizhals.at/pv-edit/such.pl?&syntax=l.link_id%3D${encodeURIComponent(idString)}`;

            window.open(url, '_blank');
        });

        // Insert button before table
        const table = document.querySelector('.ft');
        if (table) {
            buttonContainer.appendChild(button);
            buttonContainer.appendChild(warningText);
            table.parentNode.insertBefore(buttonContainer, table);
        }

        // Initial state
        updateButtonState();

        // Observer for dynamic changes
        const observer = new MutationObserver(function() {
            updateButtonState();
        });

        // Watch for table changes
        const tableBody = document.querySelector('.ft tbody');
        if (tableBody) {
            observer.observe(tableBody, { childList: true, subtree: true });
        }

        // Watch for header changes (column activation)
        if (tableHead) {
            observer.observe(tableHead, { childList: true, subtree: true });
        }

        // Also watch for counter changes
        const selectedMarker = document.querySelector('.selected__marker__wrapper');
        if (selectedMarker) {
            observer.observe(selectedMarker, { childList: true, characterData: true, subtree: true });
        }

        // Watch the entire page for dynamic updates
        const mainApp = document.querySelector('[data-app="artikel-link"]');
        if (mainApp) {
            observer.observe(mainApp, { childList: true, subtree: true });
        }
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSuchPlButton);
    } else {
        initSuchPlButton();
    }

    // Re-initialize if page dynamically reloads (React app)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                const suchPlButton = document.getElementById('such-pl-button');
                if (!suchPlButton) {
                    initSuchPlButton();
                }
            }
        });
    });

    const mainContainer = document.querySelector('.main') || document.body;
    observer.observe(mainContainer, { childList: true, subtree: true });
})();