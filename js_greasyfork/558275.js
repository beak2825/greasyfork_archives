// ==UserScript==
// @name         Neopets Event Icon Blocker
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Blocks specific event icon on the Neopets homepage. Intended fir Christmas 2025.
// @author       Logan Bell
// @match        https://www.neopets.com/home/
// @match        https://www.neopets.com/home/index.phtml
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558275/Neopets%20Event%20Icon%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/558275/Neopets%20Event%20Icon%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the selector for the element you want to block.
    // This targets the main event icon container.
    const selectorToBlock = '.hp-event-icon';

    // Find the element in the DOM.
    const element = document.querySelector(selectorToBlock);

    if (element) {
        // Block the element by completely hiding it using 'display: none'.
        // If the element causes layout shift, you could alternatively use
        // element.remove(); to remove it completely from the DOM, but hiding is safer.
        element.style.display = 'none';

        // Log to console to confirm the script ran (optional)
        console.log(`[Neopets Event Blocker] Successfully hid element: ${selectorToBlock}`);
    } else {
        // Log to console if the element wasn't found (optional)
        console.log(`[Neopets Event Blocker] Element not found: ${selectorToBlock}`);
    }
})();