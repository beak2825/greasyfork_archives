// ==UserScript==
// @name         Fix Broken Select Dropdown
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fixes malformed option tags in select dropdown that cause page stretching on Cryptic Haven upload page
// @author       kdln
// @match        https://cryptichaven.org/index.php?page=upload
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554830/Fix%20Broken%20Select%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/554830/Fix%20Broken%20Select%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixBrokenSelect);
    } else {
        fixBrokenSelect();
    }

    function fixBrokenSelect() {
        // Find the select element with id 'tag_drop'
        const selectElement = document.getElementById('tag_drop');

        if (!selectElement) {
            console.log('TagFix: Select element with id "tag_drop" not found');
            return;
        }

        console.log('TagFix: Found select element, checking for malformed options...');

        // Get the HTML content
        let html = selectElement.innerHTML;

        // Fix the specific malformed option tag
        const malformedPattern = /Andy Dick<pamela anderson<="" option="">/gi;

        if (malformedPattern.test(html)) {
            console.log('TagFix: Found malformed option tag, fixing...');
            html = html.replace(malformedPattern, 'Andy Dick</option>');
            selectElement.innerHTML = html;
            console.log('TagFix: Fixed malformed option tag');
        }

        // General cleanup: find any other malformed tags with similar patterns
        // Pattern: <option>text<something other than /option>
        const generalMalformedPattern = /<option>([^<]*)<(?!\/option>)([^>]*)>/gi;

        if (generalMalformedPattern.test(selectElement.innerHTML)) {
            console.log('TagFix: Found other malformed patterns, cleaning up...');
            html = selectElement.innerHTML;
            html = html.replace(generalMalformedPattern, '<option>$1</option>');
            selectElement.innerHTML = html;
            console.log('TagFix: Cleaned up additional malformed tags');
        }

        // Remove duplicate options
        const options = Array.from(selectElement.options);
        const seen = new Set();
        let duplicatesRemoved = 0;

        options.forEach(option => {
            const text = option.text.trim().toLowerCase();
            if (seen.has(text) && text !== '---') {
                option.remove();
                duplicatesRemoved++;
            } else {
                seen.add(text);
            }
        });

        if (duplicatesRemoved > 0) {
            console.log(`TagFix: Removed ${duplicatesRemoved} duplicate option(s)`);
        }

        console.log('TagFix: Select dropdown has been fixed!');
    }
})();
