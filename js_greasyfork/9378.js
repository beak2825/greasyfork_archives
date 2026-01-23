// ==UserScript==
// @name Google Restore Underline
// @namespace GRU
// @description Restores underlining to Google title results.
// @version 125
// @run-at  document-body
// @include http://www.google.*/*
// @include https://www.google.*/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author  drhouse
// @icon    https://cdn1.iconfinder.com/data/icons/company-identity/100/new-google-favicon-128.png
// @downloadURL https://update.greasyfork.org/scripts/9378/Google%20Restore%20Underline.user.js
// @updateURL https://update.greasyfork.org/scripts/9378/Google%20Restore%20Underline.meta.js
// ==/UserScript==

$(document).ready(function () {
    // Target h3 elements within the main search results area
    // Using multiple selectors to cover different Google layouts
    $('#search h3, #rso h3, main h3, #res h3, #botstuff h3').css('text-decoration', 'underline');

    // Use MutationObserver to handle dynamically loaded content (infinite scroll, etc.)
    const observer = new MutationObserver(function(mutations) {
        $('#search h3, #rso h3, main h3, #res h3, #botstuff h3').css('text-decoration', 'underline');
    });

    const searchContainer = document.querySelector('#search, #rso, main, #res');
    if (searchContainer) {
        observer.observe(searchContainer, { childList: true, subtree: true });
    }
});