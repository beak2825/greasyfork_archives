// ==UserScript==
// @name         Neopets Stock Market Highlighter
// @namespace    Infected@clraik
// @version      1.0.0
// @author       Infected
// @description  Highlights stocks that have a current value of 15NP, with and option to toggle 16-17NP stocks, and the Cheaper by the Dozen Boon
// @match        https://www.neopets.com/stockmarket.phtml?type=list&full=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555326/Neopets%20Stock%20Market%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/555326/Neopets%20Stock%20Market%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    let highlight10to14 = false;
    let highlight16to17 = false;

    // Default colors
    let color15 = '#00FF00';      // bright green
    let color10to14 = '#FFFF00';  // yellow
    let color16to17 = '#FF8C00';  // deep orange
    const defaultPosition = { bottom: '10px', right: '10px' };

    function highlightCurrCells() {
        const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            const headerRow = Array.from(table.querySelectorAll('tr')).find(tr =>
                tr.textContent.toLowerCase().includes('curr')
            );
            if (!headerRow) return;

            const headerCells = Array.from(headerRow.querySelectorAll('td, th'));
            const currIndex = headerCells.findIndex(td =>
                td.textContent.trim().toLowerCase() === 'curr'
            );
            if (currIndex === -1) return;

            let foundHeader = false;
            table.querySelectorAll('tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                if (!foundHeader) {
                    if (row === headerRow) foundHeader = true;
                    return;
                }
                if (cells.length <= currIndex) return;
                const currCell = cells[currIndex];
                const value = currCell.textContent.trim();

                // Reset styles
                currCell.style.backgroundColor = '';
                currCell.style.color = '';
                currCell.style.fontWeight = '';

                if (value === '15') {
                    currCell.style.backgroundColor = color15;
                    currCell.style.color = 'white';
                    currCell.style.fontWeight = 'bold';
                } else {
                    const num = parseInt(value, 10);
                    if (highlight10to14 && num >= 10 && num <= 14) {
                        currCell.style.backgroundColor = color10to14;
                        currCell.style.color = 'black';
                        currCell.style.fontWeight = 'bold';
                    }
                    if (highlight16to17 && num >= 16 && num <= 17) {
                        currCell.style.backgroundColor = color16to17;
                        currCell.style.color = 'white';
                        currCell.style.fontWeight = 'bold';
                    }
                }
            });
        });
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'np-highlight-control';
        panel.style.position = 'fixed';
        panel.style.bottom = defaultPosition.bottom;
        panel.style.right = defaultPosition.right;
        panel.style.zIndex = '9999';
        panel.style.cursor = 'move';

        panel.innerHTML = `
            <div style="
                background:#222;
                color:white;
                padding:10px;
                border-radius:8px;
                font-family:Arial, sans-serif;
                font-size:13px;
                box-shadow:0 0 8px rgba(0,0,0,0.3);
            ">
                <div style="margin-bottom:6px; font-weight:bold;">Neopets Stock Highlighter</div>

                <label style="display:block; margin-bottom:6px; cursor:pointer;">
                    <input type="checkbox" id="toggle10to14">
                    Cheaper by the Dozen Boon
                </label>

                <label style="display:block; margin-bottom:6px; cursor:pointer;">
                    <input type="checkbox" id="toggle16to17">
                    16-17NP
                </label>

                <button id="toggleColorPickers" style="
                    background:#555;color:white;border:none;padding:3px 6px;border-radius:4px;cursor:pointer;margin-top:6px;
                ">Show Colors</button>

                <div id="colorPickers" style="display:none; margin-top:6px;">
                    <div style="margin-bottom:6px;">
                        <label style="cursor:pointer;">
                            15NP Color:
                            <input type="color" id="color15" value="${color15}" style="margin-left:5px;">
                        </label>
                    </div>

                    <div style="margin-bottom:6px;">
                        <label style="cursor:pointer;">
                            10-14NP Color:
                            <input type="color" id="color10to14" value="${color10to14}" style="margin-left:5px;">
                        </label>
                    </div>

                    <div style="margin-bottom:6px;">
                        <label style="cursor:pointer;">
                            16-17NP Color:
                            <input type="color" id="color16to17" value="${color16to17}" style="margin-left:5px;">
                        </label>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Toggle 10-14 checkbox
        panel.querySelector('#toggle10to14').addEventListener('change', e => {
            highlight10to14 = e.target.checked;
            highlightCurrCells();
        });

        // Toggle 16-17 checkbox
        panel.querySelector('#toggle16to17').addEventListener('change', e => {
            highlight16to17 = e.target.checked;
            highlightCurrCells();
        });

        // Show/hide color pickers
        const toggleBtn = panel.querySelector('#toggleColorPickers');
        const colorPickersDiv = panel.querySelector('#colorPickers');
        toggleBtn.addEventListener('click', () => {
            if (colorPickersDiv.style.display === 'none') {
                colorPickersDiv.style.display = 'block';
                toggleBtn.textContent = 'Hide Colors';
            } else {
                colorPickersDiv.style.display = 'none';
                toggleBtn.textContent = 'Show Colors';
            }
        });

        // Color picker events
        panel.querySelector('#color15').addEventListener('input', e => {
            color15 = e.target.value;
            highlightCurrCells();
        });

        panel.querySelector('#color10to14').addEventListener('input', e => {
            color10to14 = e.target.value;
            highlightCurrCells();
        });

        panel.querySelector('#color16to17').addEventListener('input', e => {
            color16to17 = e.target.value;
            highlightCurrCells();
        });

        // Draggable panel
        let dragging = false, offsetX = 0, offsetY = 0;
        panel.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.transition = 'none';
        });

        document.addEventListener('mousemove', e => {
            if (dragging) {
                let left = e.clientX - offsetX;
                let top = e.clientY - offsetY;

                const margin = 10;
                if (left < margin) left = margin;
                if (top < margin) top = margin;
                if (left + panel.offsetWidth > window.innerWidth - margin)
                    left = window.innerWidth - panel.offsetWidth - margin;
                if (top + panel.offsetHeight > window.innerHeight - margin)
                    top = window.innerHeight - panel.offsetHeight - margin;

                panel.style.left = left + 'px';
                panel.style.top = top + 'px';
                panel.style.right = 'auto';
                panel.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            dragging = false;
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            createControlPanel();
            highlightCurrCells();
        }, 500);
    });
})();