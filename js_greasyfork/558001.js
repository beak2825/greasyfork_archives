// ==UserScript==
// @name         hianime.to - Move Header to Bottom
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Moves the top header bar on hianime.to to the bottom of the page
// @author       Grok
// @match        https://hianime.to/*
// @match        https://*.hianime.to/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558001/hianimeto%20-%20Move%20Header%20to%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/558001/hianimeto%20-%20Move%20Header%20to%20Bottom.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait until the page is reasonably loaded
    const waitForElements = setInterval(() => {
        const header = document.querySelector('#header');  // main top header
        const body = document.body;                         // fallback: body
        const footer = document.querySelector('#footer');   // preferred: above footer

        if (header && body) {
            clearInterval(waitForElements);

            // Remove the header from its original position
            header.remove();

            // Create a placeholder div so the layout doesn't jump
            const placeholder = document.createElement('div');
            placeholder.id = 'header-moved-placeholder';
            placeholder.style.height = header.offsetHeight + 'px';
            body.prepend(placeholder);

            // Insert the header at the bottom: after the footer (or at end of body)
            const insertPoint = footer ? footer.parentNode : body;
            insertPoint.appendChild(header);

            // Style the header for bottom placement
            header.style.position = 'relative';
            header.style.top = 'auto';
            header.style.zIndex = '999';
            header.style.width = '100%';
            header.style.marginBottom = '12px';
            header.style.boxShadow = '0 -4px 8px rgba(0,0,0,0.2)';

            // Optional: make the header sticky to the bottom when scrolling
            // Uncomment the next 2 lines if you want it to stick at the very bottom
            /*
            header.style.position = 'sticky';
            header.style.bottom = '0';
            header.style.background = '#141414';
            */

            console.log('hianime.to header moved to bottom');
        }
    }, 300);

    // Safety timeout
    setTimeout(() => clearInterval(waitForElements), 15000);
})();