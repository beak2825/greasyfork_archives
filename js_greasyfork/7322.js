// ==UserScript==
// @name        Google Calendar with colored weekend days
// @namespace   userscripts.org/user/swyter
// @description Sets the background of the weekends in month view to smoky white, customize it easily for your own needs.
// @match       https://www.google.com/calendar/*
// @version     1.1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7322/Google%20Calendar%20with%20colored%20weekend%20days.user.js
// @updateURL https://update.greasyfork.org/scripts/7322/Google%20Calendar%20with%20colored%20weekend%20days.meta.js
// ==/UserScript==

GM_addStyle(".mv-event-container td:nth-child(6),  \
             .mv-event-container td:nth-child(7)   \
             {                                     \
                background-color: whitesmoke;      \
                border-left: 1px solid #ddd;       \
             }                                     ");