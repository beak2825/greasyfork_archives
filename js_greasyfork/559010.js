// ==UserScript==
// @name         GitLab Issue Board - Card highlight on right mouse click
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a better visual highlight on issue card focus. Activated with right mouse click on the issue card.
// @author       jachoo
// @match        https://gitlab.com/*/*/boards*
// @match        https://gitlab.com/*/*/-/boards*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/559010/GitLab%20Issue%20Board%20-%20Card%20highlight%20on%20right%20mouse%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/559010/GitLab%20Issue%20Board%20-%20Card%20highlight%20on%20right%20mouse%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add a global CSS rule for focus
    const style = document.createElement('style');
    style.textContent = `
        li.board-card:focus, li.board-card:active, a.board-card-button:focus, a.board-card-button:active {
            background: indigo !important;
        }
    `;
    document.head.appendChild(style);

    // Disable the context menu on Issue (event delegation)
    document.addEventListener('contextmenu', function(event) {
        // Check whether the click was on the Issue card or inside it.
        const target = event.target.closest('.board-card, [data-testid="board-card"]');

        if (target) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);

    console.log('GitLab Issue Board: Context menu disabled & focus style added');
})();
