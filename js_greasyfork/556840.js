// ==UserScript==
// @name         Sliw.co's Cracking Rig Simulator - Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes all numerical values from tables of Sliw.co's Cracking Rig Simulator.
// @author       Gemini
// @match        https://sliw.co/rig/*
// @grant        none
// @run-at       document-idle
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/556840/Sliwco%27s%20Cracking%20Rig%20Simulator%20-%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/556840/Sliwco%27s%20Cracking%20Rig%20Simulator%20-%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';    
    const numberOnlyRegex = /^-?\s*\d+(\.\d+)?\s*$/; // Check if the content is solely a number included sign/decimal, potentially surrounded by space
    function processTableCell(td) {
       
        if (td.classList.contains('hot')) {
            td.classList.remove('hot'); // Remove the 'hot' class
        }
        let currentText = td.textContent;
        if (numberOnlyRegex.test(currentText)) {
            td.textContent = '';
        } else {            
            td.textContent = currentText.replace(/-?\d+(\.\d+)?/g, '').trim(); // Targets floating-point numbers
        }
    }
    function cleanRigTables() {
        const rigTables = document.querySelectorAll('table.rig');
        if (rigTables.length === 0) {
            return;
        }
        rigTables.forEach(table => {
            const tdElements = table.querySelectorAll('td');
            tdElements.forEach(processTableCell);
        });
    }
    cleanRigTables();
    // Handle dynamic updates
    const observer = new MutationObserver(() => {
        cleanRigTables();
    });
    const observerConfig = { childList: true, subtree: true }; 
    observer.observe(document.body, observerConfig); 

})();