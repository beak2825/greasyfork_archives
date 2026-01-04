// ==UserScript==
// @name         Google Sheets Focus Cell
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlights the row and column of the active cell in Google Sheets (like Excel's Focus Cell)
// @author       Nicolai Mihaic
// @license      MIT
// @match        https://docs.google.com/spreadsheets/d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557099/Google%20Sheets%20Focus%20Cell.user.js
// @updateURL https://update.greasyfork.org/scripts/557099/Google%20Sheets%20Focus%20Cell.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HIGHLIGHT_COLOR = 'rgba(100, 150, 255, 0.15)';
    let lastCellData = null;
    let highlightsEnabled = true;

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'focus-cell-toggle';
        button.textContent = '👁️';
        button.setAttribute('title', 'Toggle Focus Cell Highlighting (On)');
        button.style.cssText = `
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            background-color: #4285f4 !important;
            color: white !important;
            border: none !important;
            font-size: 24px !important;
            cursor: pointer !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3) !important;
            z-index: 10000 !important;
            transition: all 0.3s ease !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        });

        button.addEventListener('click', () => {
            highlightsEnabled = !highlightsEnabled;

            if (highlightsEnabled) {
                button.style.backgroundColor = '#4285f4';
                button.textContent = '👁️';
                button.setAttribute('title', 'Toggle Focus Cell Highlighting (On)');
                updateHighlights();
            } else {
                button.style.backgroundColor = '#999';
                button.textContent = '👁️‍🗨️';
                button.setAttribute('title', 'Toggle Focus Cell Highlighting (Off)');
                hideHighlights();
            }
        });

        document.body.appendChild(button);
    }

    function findActualCell() {
        const activeBorder = document.querySelector('.active-cell-border');
        if (!activeBorder) return null;

        const borderRect = activeBorder.getBoundingClientRect();
        const cells = document.querySelectorAll('.grid-container ~ div td, table.waffle td');

        for (let cell of cells) {
            const cellRect = cell.getBoundingClientRect();
            if (Math.abs(cellRect.left - borderRect.left) < 5 &&
                Math.abs(cellRect.top - borderRect.top) < 5) {
                return cellRect;
            }
        }

        const canvas = document.querySelector('canvas');
        if (canvas) {
            return {
                left: borderRect.left,
                top: borderRect.top,
                width: borderRect.width,
                height: 21,
                right: borderRect.right,
                bottom: borderRect.top + 21
            };
        }

        return null;
    }

    function getHighlightElements() {
        let rowHighlight = document.getElementById('focus-cell-row');
        let colHighlight = document.getElementById('focus-cell-col');

        if (!rowHighlight) {
            rowHighlight = document.createElement('div');
            rowHighlight.id = 'focus-cell-row';
            rowHighlight.style.cssText = `
                position: fixed !important;
                background-color: ${HIGHLIGHT_COLOR} !important;
                pointer-events: none !important;
                z-index: 999 !important;
                display: none !important;
            `;
            document.body.appendChild(rowHighlight);
        }

        if (!colHighlight) {
            colHighlight = document.createElement('div');
            colHighlight.id = 'focus-cell-col';
            colHighlight.style.cssText = `
                position: fixed !important;
                background-color: ${HIGHLIGHT_COLOR} !important;
                pointer-events: none !important;
                z-index: 999 !important;
                display: none !important;
            `;
            document.body.appendChild(colHighlight);
        }

        return { rowHighlight, colHighlight };
    }

    function updateHighlights() {
        if (!highlightsEnabled) return;

        const cellRect = findActualCell();
        if (!cellRect) {
            hideHighlights();
            return;
        }

        const cellData = `${Math.round(cellRect.left)},${Math.round(cellRect.top)}`;
        if (cellData === lastCellData) return;
        lastCellData = cellData;

        const viewport = document.querySelector('canvas') || document.querySelector('#docs-editor');
        if (!viewport) return;

        const viewportRect = viewport.getBoundingClientRect();
        const { rowHighlight, colHighlight } = getHighlightElements();

        rowHighlight.style.left = viewportRect.left + 'px';
        rowHighlight.style.top = cellRect.top + 'px';
        rowHighlight.style.width = viewportRect.width + 'px';
        rowHighlight.style.height = cellRect.height + 'px';
        rowHighlight.style.display = 'block';

        colHighlight.style.left = cellRect.left + 'px';
        colHighlight.style.top = viewportRect.top + 'px';
        colHighlight.style.width = cellRect.width + 'px';
        colHighlight.style.height = viewportRect.height + 'px';
        colHighlight.style.display = 'block';
    }

    function hideHighlights() {
        const rowHighlight = document.getElementById('focus-cell-row');
        const colHighlight = document.getElementById('focus-cell-col');

        if (rowHighlight) rowHighlight.style.display = 'none';
        if (colHighlight) colHighlight.style.display = 'none';

        lastCellData = null;
    }

    function startMonitoring() {
        setInterval(updateHighlights, 100);

        const triggerUpdate = () => setTimeout(updateHighlights, 50);
        document.addEventListener('mousedown', triggerUpdate);
        document.addEventListener('mouseup', triggerUpdate);
        document.addEventListener('click', triggerUpdate);
        document.addEventListener('keydown', triggerUpdate);
        document.addEventListener('keyup', triggerUpdate);
        window.addEventListener('scroll', updateHighlights, true);

        setTimeout(updateHighlights, 500);
    }

    function waitForSheetsToLoad(callback) {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            if (document.querySelector('.active-cell-border') && document.querySelector('canvas')) {
                clearInterval(checkInterval);
                callback();
            } else if (++attempts >= 30) {
                clearInterval(checkInterval);
                callback();
            }
        }, 200);
    }

    waitForSheetsToLoad(() => {
        createToggleButton();
        startMonitoring();
    });

})();