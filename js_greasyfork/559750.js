// ==UserScript==
// @name         Ziggo GigaBox: Apparaat Labels (Multi-Page)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Voegt de mogelijkheid toe om apparaatnamen in de Ziggo GigaBox aan te passen. Werkt op status- en DHCP-pagina's.
// @author       Nigel1992
// @match        *://192.168.178.1/*
// @match        *://192.168.1.1/*
// @match        *://gwlogin.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559750/Ziggo%20GigaBox%3A%20Apparaat%20Labels%20%28Multi-Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/559750/Ziggo%20GigaBox%3A%20Apparaat%20Labels%20%28Multi-Page%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const STORAGE_KEY = 'ziggo_custom_device_names';
    const ZIGGO_ORANGE = '#ef7d00';
    const ZIGGO_RED = '#d10000';
    const MAC_REGEX = /([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/;
 
    function renderCell(cell, customName, originalName, mac) {
        cell.innerHTML = '';
        cell.style.paddingTop = '2px';
        cell.style.paddingBottom = '2px';
        cell.style.verticalAlign = 'middle';
        cell.style.cursor = 'pointer';
 
        const container = document.createElement('div');
        container.style = "display: flex; align-items: center; gap: 6px; white-space: nowrap; height: 24px;";
 
        const iconDock = document.createElement('div');
        iconDock.style = "display: flex; gap: 2px; flex-shrink: 0;";
 
        const pencil = document.createElement('div');
        pencil.innerHTML = '✎';
        pencil.style = `background: ${ZIGGO_ORANGE}; color: white; width: 16px; height: 16px;
                        border-radius: 2px; display: flex; align-items: center; justify-content: center;
                        font-size: 9px; line-height: 1;`;
        iconDock.appendChild(pencil);
 
        if (customName) {
            const resetX = document.createElement('div');
            resetX.innerHTML = '✕';
            resetX.style = `background: ${ZIGGO_RED}; color: white; width: 16px; height: 16px;
                            border-radius: 2px; display: flex; align-items: center; justify-content: center;
                            font-size: 8px; font-weight: bold;`;
            resetX.onclick = (e) => {
                e.stopPropagation();
                const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
                delete store[mac];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
                renderCell(cell, null, originalName, mac);
            };
            iconDock.appendChild(resetX);
        }
 
        const textSpan = document.createElement('span');
        textSpan.style = "overflow: hidden; text-overflow: ellipsis; display: flex; align-items: baseline; gap: 4px;";
 
        if (customName) {
            textSpan.innerHTML = `
                <b style="color: ${ZIGGO_ORANGE}; font-size: 0.9em;">${customName}</b>
                <small style="color: #999; font-size: 0.75em;">(${originalName})</small>
            `;
        } else {
            textSpan.innerHTML = `<span style="font-size: 0.9em; color: #444;">${originalName}</span>`;
        }
 
        container.appendChild(iconDock);
        container.appendChild(textSpan);
        cell.appendChild(container);
 
        cell.onmouseenter = () => { cell.style.backgroundColor = 'rgba(239, 125, 0, 0.05)'; };
        cell.onmouseleave = () => { cell.style.backgroundColor = ''; };
        cell.onclick = () => enterEditMode(cell, customName || originalName, originalName, mac);
    }
 
    function enterEditMode(cell, currentVal, originalName, mac) {
        cell.innerHTML = '';
        const input = document.createElement('input');
        input.value = currentVal;
        input.style = "width: 90%; height: 20px; font-size: 0.85em; border: 1px solid " + ZIGGO_ORANGE + "; padding: 0 4px; outline: none;";
 
        cell.appendChild(input);
        input.focus();
        input.select();
 
        const save = () => {
            const newVal = input.value.trim();
            const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            if (newVal && newVal !== originalName) store[mac] = newVal;
            else delete store[mac];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
            renderCell(cell, store[mac] || null, originalName, mac);
        };
 
        input.onblur = save;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') renderCell(cell, (currentVal !== originalName ? currentVal : null), originalName, mac);
        };
    }
 
    function processRows() {
        // Updated selector to find rows on both Status and DHCP pages
        const rows = document.querySelectorAll('tr.dataRow, tr[class*="row-"]');
        const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
 
        rows.forEach(row => {
            let nameCell = null;
            let mac = null;
 
            // Loop through cells to find the MAC address and the Name cell
            Array.from(row.cells).forEach((cell, index) => {
                const text = cell.innerText.trim();
                const macMatch = text.match(MAC_REGEX);
 
                if (macMatch) {
                    mac = macMatch[0].toUpperCase();
                    // On most pages, the Name is the first cell (index 0)
                    // On DHCP Reservation pages, it might be the cell before the MAC
                    nameCell = row.cells[0];
                }
            });
 
            if (!nameCell || !mac) return;
 
            if (!nameCell.hasAttribute('data-orig')) {
                nameCell.setAttribute('data-orig', nameCell.innerText.trim());
            }
 
            const orig = nameCell.getAttribute('data-orig');
 
            if (!nameCell.hasAttribute('data-init')) {
                nameCell.setAttribute('data-init', 'true');
                renderCell(nameCell, savedData[mac], orig, mac);
            }
        });
    }
 
    processRows();
    new MutationObserver(processRows).observe(document.body, { childList: true, subtree: true });
})();