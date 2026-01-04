// ==UserScript==
// @name         Submission Grinder Simple Dark Mode
// @namespace    http://tampermonkey.net/
// @version      2025-11-04
// @description  Really quick dark-mode for The Submission Grinder
// @author       Robert Luke Wilkins, who quite likes to sit in the dark and write without getting unexpectedly blinded
// @match        https://thegrinder.diabolicalplots.com/*
// @icon         https://thegrinder.diabolicalplots.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556452/Submission%20Grinder%20Simple%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/556452/Submission%20Grinder%20Simple%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A quick dark mode for The Submission Grinder
    GM_addStyle(`
        html {
            /* Invert all the colors as the base for the dark mode */
            filter: invert(1);
        }
        html, body {
            background-color: #FFF;
        }
        /* For the charts, reset the palette to default (inverted is hard to read), but make them less stark by dropping contrast */
        #subRecencyChart, #responseRecencyChart, #turnAroundChart {
            filter: invert(1) contrast(70%);
        }
        /* For non-standard pending status types, reset all the palette inversions to keep the default orange & red colors */
        .SubmissionResultStatusExceedsEstimated, .SubmissionResultStatusExceedsAverage {
            filter: invert(1);
        }
        /* Make the legend a little easier to read in dark mode by raising the opacity from 0.6 to 0.8 */
        table.jqplot-table-legend, .jqplot-table-legend {
            background: rgba(255, 255, 255, 0.8);
        }
        /* Lastly, override the basic link colors, because the default palette inversions aren't great */
        a {
            color: #aa3;
        }
        a:visited {
            color: #3a3;
        }
    `);
})();