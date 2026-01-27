// ==UserScript==
// @name         HEADER Corrector SSC All Users
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Change specific text and forced focus on "To" field
// @author       Your Name
// @match        https://salsabeelcars.site/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563613/HEADER%20Corrector%20SSC%20All%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/563613/HEADER%20Corrector%20SSC%20All%20Users.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replacements = [
        {
            selector: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_left > p',
            newHTML: "<strong>OFFER/</strong><br>QUOTATION"
        },
        {
            selector: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_right > p:nth-child(1) > strong',
            newHTML: "<strong>Tel &nbsp;:&nbsp; +880-2-222293331-5</strong>"
        },
        {
            selector: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(2) > div > p > b',
            newHTML: "<b>QUOTATION FOR BRAND NEW/RECONDITIONED MOTOR VEHICLE</b>"
        },
        {
            selector: 'body > div.wrapper > div.content-wrapper > section > div > div > div.panel-body > div:nth-child(1) > div > div.col-sm-3.top_right > p:nth-child(2)',
            newHTML: ""
        }
    ];

    const updatedPaths = new Set();
    let hasFocused = false;

    function forceFocus(el) {
        if (!el || hasFocused) return;

        // Set focus and try to trigger keyboard
        el.focus();
        
        // Mobile browsers often require a "click" to show keyboard
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        el.dispatchEvent(clickEvt);
        
        // Double-check focus
        if (document.activeElement === el) {
            hasFocused = true;
        }
    }

    function applyUpdates() {
        // 1. Handle Text Replacements
        replacements.forEach((item, index) => {
            if (updatedPaths.size === replacements.length) return;
            const target = document.querySelector(item.selector);
            if (target && !updatedPaths.has(index)) {
                target.innerHTML = item.newHTML;
                updatedPaths.add(index);
            }
        });

        // 2. Target the specific ID you provided
        const toField = document.getElementById('to');
        if (toField && !hasFocused) {
            // Short delay helps ensure the browser is ready to accept focus
            setTimeout(() => forceFocus(toField), 100);
        }

        // Clean up observer if everything is done
        if (updatedPaths.size === replacements.length && hasFocused) {
            observer.disconnect();
        }
    }

    // Run on window load to ensure everything is rendered
    window.addEventListener('load', applyUpdates);

    // Also use MutationObserver for dynamic content
    const observer = new MutationObserver(() => {
        applyUpdates();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Final fallback: try once more after a brief moment
    setTimeout(applyUpdates, 500);
})();