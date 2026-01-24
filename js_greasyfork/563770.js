// ==UserScript==
// @name         Simple Page Word Counter
// @namespace    https://greasyfork.org/users/your-id-here
// @version      1.0.0
// @description  Counts the number of words on the current webpage and shows the result in an alert.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license      MIT
// @language     en
// @downloadURL https://update.greasyfork.org/scripts/563770/Simple%20Page%20Word%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/563770/Simple%20Page%20Word%20Counter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Get visible text from the page
     */
    function getPageText() {
        return document.body.innerText || '';
    }

    /**
     * Count words in a string
     * @param {string} text
     */
    function countWords(text) {
        if (!text) {
            return 0;
        }

        return text
            .trim()
            .split(/\s+/)
            .filter(word => word.length > 0)
            .length;
    }

    /**
     * Main execution
     */
    function runWordCounter() {
        const text = getPageText();
        const wordCount = countWords(text);

        alert('Word count on this page: ' + wordCount);
    }

    // Run after page load
    window.addEventListener('load', runWordCounter);
})();
