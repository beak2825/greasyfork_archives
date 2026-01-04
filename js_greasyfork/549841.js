// ==UserScript==
// @name         BAR-I Custom SCC Styles
// @namespace    https://greasyfork.org/users/1516265
// @version      1.0.2
// @description  Adds custom CSS to the BAR-I SCC interface
// @author       Nicolai Mihaic
// @match        https://app.bar-i.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bar-i.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/549841/BAR-I%20Custom%20SCC%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/549841/BAR-I%20Custom%20SCC%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* Your custom CSS rules go here */
        .search-box input.bg-fa {
           background-color: #e9ecef;
           border: 1px solid gray;
         }
         .left-sidebar ul li a.active, .left-sidebar ul li a:active {
           background-color: #ca302d40;
         }
         .left-sidebar ul li a[aria-expanded=true]{
           background: #ebe7e7;
           color: #ca302d;
         }
         .top-tab-btn a.btn {
           border-radius: 10px;
           margin: 0 3px;
           border-left-width: 1px;
         }
         .btn-primary {
           border-radius: 5px;
         }
         .quickFilterCheckbox{
           font-family: Lato-bold, sans-serif;
         }
/* Sticky topbar styles 
.gray-alertbar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100% !important;
    z-index: 9999 !important;
    text-align: center !important;
    background: #979797 !important;
    color: #fff !important;
    padding: 3px 15px !important;
    font-size: 12px !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
} */

/* Button styling for "Back To Dashboard" link */
.gray-alertbar a {
    display: inline-block !important;
    color: #f7f0f0 !important;
    background: #ca302d !important;
    border-color: #ca302d !important;
    padding: 2px 6px !important;
    border-radius: 3px !important;
    text-decoration: none !important;
    font-weight: 500 !important;
    border: 1px solid #ca302d !important;
    cursor: pointer !important;
    transition: all 0.2s ease !important;
    margin-left: 8px !important;
    font-size: 12px !important;
    opacity: 1 !important;
}

.gray-alertbar a:hover {
    background: #b02825 !important;
    border-color: #b02825 !important;
    text-decoration: none !important;
}

.gray-alertbar a:focus {
    outline: 2px solid #ca302d !important;
    outline-offset: 2px !important;
}

.btn-primary.btn-primary.disabled, .btn-primary.btn-primary:disabled {
    color: #de807f !important;
    opacity: 1 !important;
    background: #ca302d !important;
    border-color: #ca302d !important;
}

/* Add top margin to body to prevent content being hidden behind fixed topbar */
body.has-sticky-topbar {
    margin-top: 28px !important;
}
    `);
})();
