// ==UserScript==
// @name         Hide Google AI Overview and AI Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides the AI Overview section in Google and hides the AI Mode button.
// @author       Frost-Core
// @match        *://www.google.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559575/Hide%20Google%20AI%20Overview%20and%20AI%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/559575/Hide%20Google%20AI%20Overview%20and%20AI%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideDiv = () => {
        document.querySelectorAll('div').forEach(div => {
            if (div.classList.contains('YzCcne') || div.classList.contains('olrp5b') || div.classList.contains('WE0UJf')) {
                div.style.display = 'none';
            }
        });
    };
    const hideButton = () => {
        // hide button
        document.querySelectorAll('button').forEach(button => {
            if (button.classList.contains('plR5qb')) {
                button.style.display = 'none';
            }
        });
    };

    document.addEventListener('DOMContentLoaded', hideButton);
    new MutationObserver(hideButton).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', hideDiv);
    new MutationObserver(hideDiv).observe(document.body, { childList: true, subtree: true });
})();

