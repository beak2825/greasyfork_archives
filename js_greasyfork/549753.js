// ==UserScript==
// @name         jpdb.io - show non-redundant vocab on learn page
// @namespace    http://tampermonkey.net/
// @description  Replaces the "You know" known words stat with the "Total known non-redundant vocabulary" value
// @version      1.2
// @author       JawGBoi
// @match        https://jpdb.io/learn*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/549753/jpdbio%20-%20show%20non-redundant%20vocab%20on%20learn%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/549753/jpdbio%20-%20show%20non-redundant%20vocab%20on%20learn%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const totalWords = document.querySelector('table.cross-table tr:nth-child(2) td:nth-child(2)');
    const knownWords = document.querySelector('table.cross-table tr:nth-child(2) td:last-child');
    const nonRedundantSection = document.querySelector('table.cross-table + p');

    // script can only run if required elements are found
    if (nonRedundantSection && totalWords && knownWords) {
        try {
            // find the number at the end of the paragraph's text:
            const nonRedundantText = nonRedundantSection.textContent;
            const nonRedundantMatch = nonRedundantText.match(/(\d+)$/);
            const nonRedundantCount = parseInt(nonRedundantMatch[1], 10);

            // get total word count
            const totalNoWord = parseInt(totalWords.textContent.replace(/,/g, ''), 10);

            nonRedundantSection.remove(); // no need for the redundant words section anymore

            // recalculate percentage:
            let newPercentage = 0;
            if (totalNoWord > 0) {
                newPercentage = Math.floor((nonRedundantCount / totalNoWord) * 100);
            }

            knownWords.textContent = `${nonRedundantCount} (${newPercentage}%)`;

        }
        catch (error)
        {
            console.error("jpdb non redundant vocab script error:", error);
        }
    }
})();