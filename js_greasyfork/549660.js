// ==UserScript==
// @name         Clean up reservations list for printing tags
// @namespace    https://github.com/laurenipsum/TTL
// @version      1.1
// @description  Modify the TTL myTurn reservations list for display and for printing reservation tags
// @author       ipsum
// @match        https://tacomatoollibrary.myturn.com/library/orgInventory/listReservations*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549660/Clean%20up%20reservations%20list%20for%20printing%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/549660/Clean%20up%20reservations%20list%20for%20printing%20tags.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var css = "/* always present, not just in print CSS */\n\n";

    css += "/* hide the membership type badge */\n";
    css += "span .badge { display: none; }\n\n";

    css += "/* hide the mailto envelope icons */\n";
    css += "a[href^=\"mailto:\"] { display: none; }\n\n";

    css += "/* make the alert text for problem items show up on the page */\n";
    css += ".badge-danger::after {\n";
    css += "    content: attr(data-original-title);\n";
    css += "    display: inline-block;\n";
    css += "    margin-left: 8px;\n";
    css += "    color: white !important;\n";
    css += "    background: #F3565D !important;\n";
    css += "    padding: 2px 6px;\n";
    css += "    border-radius: 3px;\n";
    css += "    font-size: 1.2rem;\n";
    css += "    font-weight: bold;\n";
    css += "}\n\n";

    css += "/* style the inline user alert message */\n";
    css += ".inline-warning {\n";
    css += "    padding: 4px 8px;\n";
    css += "    background: white;\n";
    css += "    color: #F3565D;\n";
    css += "    font-weight: normal;\n";
    css += "    display: inline-block;\n";
    css += "    max-width: 300px;\n";
    css += "}\n\n";

    css += "/* style the date if unfulfilled order date has passed */\n";
    css += ".unfulfilled-reservation-date { display: block; }\n\n";

    css += "/* style the pickup days missed message */\n";
    css += ".pickup-days-missed {\n";
    css += "    display: block;\n";
    css += "    color: #F3565D;\n";
    css += "    font-size: 1.5rem;\n";
    css += "}\n\n";

    css += ".hidden-xs, .hidden-sm, .hidden-md { display: none; }\n\n";

    css += "/* make reservation notes bigger */\n";
    css += "div.reservation-notes { font-size: 15px !important; }\n\n";

    css += "/* print stylesheet only */\n";
    css += "@media print {\n\n";

    css += "    /* delete stuff at top of page */\n";
    css += "    h3.page-title, div.portlet-title { display: none; }\n\n";

    css += "    /* hide reservation number */\n";
    css += "    .col-sm-5 { font-size: 0 !important; }\n";
    css += "    div .panel-heading, .col-sm-5 * { font-size: 30px !important; }\n\n";

    css += "    /* hide button rows */\n";
    css += "    div.panel-body > div:nth-child(1) > div.col-sm-7.col-sm-push-5.text-right.margin-bottom-10 { display: none; }\n\n";

    css += "    /* page break after each reservation, except the last one */\n";
    css += "    .panel.reservation:not(:last-child) {\n";
    css += "        break-after: page !important; }\n\n";

    css += "    /* make the order status badges bigger */\n";
    css += "    .badge.pull-right { display: none !important; }\n\n";

    css += "    /* get rid of scroll to top button */\n";
    css += "    .scroll-to-top { display: none !important; }\n\n";

    css += "    /* make location bigger */\n";
    css += "    table.table { font-size: 25px !important; }\n\n";

    css += "    /* adjusting relative widths of dates and names */\n";
    css += "    .col-sm-7 { width: 35%; font-size: 14px;}\n";
    css += "    .col-sm-5 { width: 50%; }\n";
    css += "    .col-xs-8.col-sm-9 { width: 90% !important; }\n";
    css += "    .col-xs-4.col-sm-3 { width: 10%; }\n\n";

    css += "    /* adjusting relative widths of items on table */\n";
    css += "    th.col-xs-1 { width: 0px !important; }\n";
    css += "    th.col-xs-3 { width: 15%; }\n";
    css += "    th.col-xs-4 { width: 55%; }\n\n";

    css += "     /* i don't want smalls */\n";
    css += "    small { font-size: inherit !important; }\n\n";

    css += "    /* i don't want the new history icon to print */\n";
    css += "    i.fa-history { display: none !important; }\n\n";

    css += "    /* hide the edit link on admin notes when printing  */\n";
    css += "    div.col-xs-3.col-sm-1.text-center { display: none !important; }\n\n";

    css += "    /* for any col-sm-9 that contains a reservation notes div, make it 100% width to fill the space left by the display:none edit column and also to make it wrap so the \"admin notes\" label is stacked on top*/\n";
    css += "    .col-sm-9:has(.reservation-notes) { width: 100% !important; }\n\n";

    css += "    /* target the location column (3rd td) to make it a monospace serif font for better legibility of I, l, and 1  */\n";
    css += "    div.reservation table.table tbody tr td:nth-child(3) { font-family: monospace, serif !important; }\n\n";

    css += "    /* make reservation table headers bigger */\n";
    css += "    div.reservation table thead tr th { font-size: 20px !important; }\n\n";

    css += "    /* make alert icons bigger when printing */\n";
    css += "    .badge-danger, .reservation-alert, .reservation-alert i {\n";
    css += "        font-size: 2rem !important;\n";
    css += "        background: #F3565D !important;\n";
    css += "        font-weight: bold;\n";
    css += "        color: white;\n";
    css += "        padding: 3px 10px;\n";
    css += "        height: 3rem;\n";
    css += "    }\n\n";

    css += "    /* style the inline user alert message for print */\n";
    css += "    .inline-warning {\n";
    css += "        padding: 4px 8px;\n";
    css += "        color: #F3565D !important;\n";
    css += "        font-weight: normal;\n";
    css += "        display: inline-block !important;\n";
    css += "        font-size: 20px !important;\n";
    css += "        max-width: 500px;\n";
    css += "    }\n\n";

    css += "    /* hide the email icon */\n";
    css += "    i.fa-envelope { display: none !important; }\n\n";

    css += "    /* remove color on borders */\n";
    css += "    .panel.reservation, .panel.success, div.panel-heading { border-color: #ddd !important; }\n\n";

    css += "    /* make alert text show up when printing */\n";
    css += "    .badge-danger::after {\n";
    css += "        content: attr(data-original-title);\n";
    css += "        display: inline-block;\n";
    css += "        margin: 8px;\n";
    css += "        color: #F3565D !important;\n";
    css += "        padding: 2px;\n";
    css += "        border-radius: 3px;\n";
    css += "        font-size: 25px !important;\n";
    css += "        font-weight: bold;\n";
    css += "    }\n\n";

    css += "    /* style unfulfilled reservation date for print */\n";
    css += "    .unfulfilled-reservation-date {\n";
    css += "        display: block;\n";
    css += "    }\n\n";

    css += "    /* style pickup days missed for print */\n";
    css += "    .pickup-days-missed {\n";
    css += "        display: block;\n";
    css += "        color: #F3565D !important;\n";
    css += "        font-size: 1.5rem !important;\n";
    css += "    }\n\n";

    css += "} /* end print styles */";

    var styleElement = document.createElement("style");
    styleElement.type = "text/css";
    styleElement.innerHTML = css;
    document.head.appendChild(styleElement);
})();
