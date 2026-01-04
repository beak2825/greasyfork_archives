// ==UserScript==
// @name         Disable JanitorAI Snowfall
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Disables the SnowfallCanvas to prevent nausea.
// @author       kawau-tui
// @match        *://janitorai.com/*
// @grant        none
// @license     MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/558668/Disable%20JanitorAI%20Snowfall.user.js
// @updateURL https://update.greasyfork.org/scripts/558668/Disable%20JanitorAI%20Snowfall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The specific selector for the snowfall canvas
    const selector = 'canvas[data-testid="SnowfallCanvas"]';

    // The CSS to hide it and ensure it doesn't take up space/processing
    const css = `
        ${selector} {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            height: 0px !important;
            width: 0px !important;
        }
    `;

    // Function to inject styles
    const injectStyle = () => {
        if (document.head) {
            const style = document.createElement('style');
            style.id = 'kill-snowfall-css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        } else {
            // If head isn't ready yet, wait for it
            const observer = new MutationObserver(() => {
                if (document.head) {
                    injectStyle();
                    observer.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true });
        }
    };

    injectStyle();

    console.log('Snowfall blocker initialized.');
})();