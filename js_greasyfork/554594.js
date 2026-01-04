// ==UserScript==
// @name         Input Filter: Final Punctuation and Indent Clean-Up
// @namespace    http://tampermonkey.net/
// @version      7
// @description  Aggressively removes forbidden symbols, all tabs, and all leading spaces (indentation) while preserving single spaces between words.
// @author       Gemini
// @match        https://www.aiuncensored.info/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554594/Input%20Filter%3A%20Final%20Punctuation%20and%20Indent%20Clean-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/554594/Input%20Filter%3A%20Final%20Punctuation%20and%20Indent%20Clean-Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Regex for specific forbidden punctuation symbols (Original List)
    // Removed symbols are: -, –, —, *, (, ), [, ], …
    const FORBIDDEN_PUNCTUATION_REGEX = /[-–—\*\(\)\[\]…]/g;

    // 2. Regex to remove all Tab characters (\t) and Non-Breaking Spaces (\xA0) globally.
    // Tabs and other invisible junk are removed anywhere they occur.
    const TAB_AND_NBSP_REGEX = /[\t\xA0]/g; 

    // 3. Regex to remove ALL LEADING WHITESPACE (spaces and tabs) at the beginning of a line.
    // This is the dedicated solution for your indentation issue. 
    // ^\s+ : Matches one or more spaces/tabs at the beginning of a line.
    const LEADING_WHITESPACE_REGEX = /^\s+/gm; 

    /**
     * Filters the input value in three precise steps.
     */
    function filterInput(event) {
        const inputElement = event.target;
        
        // Target standard input/textarea elements and contenteditable divs
        const isEditable = inputElement.matches('input[type="text"], input[type="search"], textarea') || 
                           (inputElement.hasAttribute('contenteditable') && inputElement.getAttribute('contenteditable') === 'true');

        if (isEditable) {
            let currentValue = inputElement.value || inputElement.textContent;
            let cleanedValue = currentValue;

            // Step A: Remove forbidden punctuation
            cleanedValue = cleanedValue.replace(FORBIDDEN_PUNCTUATION_REGEX, '');
            
            // Step B: Remove Tabs and Non-Breaking Spaces
            cleanedValue = cleanedValue.replace(TAB_AND_NBSP_REGEX, ''); 
            
            // Step C: Remove ALL leading indentation (spaces and tabs)
            // This is applied last to ensure it cleans up any indentation that remains after B.
            cleanedValue = cleanedValue.replace(LEADING_WHITESPACE_REGEX, ''); 
            
            // Only update the DOM if a change actually occurred
            if (currentValue !== cleanedValue) {
                if (inputElement.matches('textarea, input')) {
                    inputElement.value = cleanedValue;
                } else {
                    inputElement.textContent = cleanedValue;
                }
                
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
    }

    // Attach the filter function to the 'input' event on the document body.
    document.body.addEventListener('input', filterInput, true);

})();
