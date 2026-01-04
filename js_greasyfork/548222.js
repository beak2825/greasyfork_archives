// ==UserScript==
// @name         Focus Search Input on Car List
// @namespace    https://salsabeelcars.site/
// @version      1.0
// @description  Focus on the search input on page load, but only once per session
// @author       Your Name
// @match        https://salsabeelcars.site/index.php/admin*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548222/Focus%20Search%20Input%20on%20Car%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/548222/Focus%20Search%20Input%20on%20Car%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to focus on the input field
    function focusSearchInput() {
        const searchInput = document.querySelector('#carList_filter > label > input[type=search]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    // Wait for the page to load completely
    window.addEventListener('load', focusSearchInput);
})();