// ==UserScript==
// @name         Enable Copy Paste Everywhere
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Force enable copy, paste, cut, select text, and right-click on all websites
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/562513/Enable%20Copy%20Paste%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/562513/Enable%20Copy%20Paste%20Everywhere.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Stop sites from blocking events
    const events = [
        'copy',
        'cut',
        'paste',
        'selectstart',
        'contextmenu',
        'keydown',
        'mousedown',
        'mouseup'
    ];

    events.forEach(event => {
        document.addEventListener(event, e => {
            e.stopPropagation();
        }, true);
    });

    // Remove inline event handlers
    function removeHandlers(element) {
        if (!element) return;
        events.forEach(event => {
            element[`on${event}`] = null;
        });
    }

    // Apply to document and body
    removeHandlers(document);
    removeHandlers(document.body);

    // Force CSS to allow selection
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            user-select: text !important;
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
        }
    `;
    document.documentElement.appendChild(style);

    // Observe DOM changes and clean new elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    removeHandlers(node);
                }
            });
        });
    });

    observer.observe(document, { childList: true, subtree: true });

})();
