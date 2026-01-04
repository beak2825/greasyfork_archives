// ==UserScript==
// @name         Fetlife Enter Key Auto-Send
// @namespace    https://fetlife.com/
// @version      1.0
// @description  Press Enter to click "Say It!" button, Shift+Enter for newline
// @match        https://fetlife.com/conversations/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552317/Fetlife%20Enter%20Key%20Auto-Send.user.js
// @updateURL https://update.greasyfork.org/scripts/552317/Fetlife%20Enter%20Key%20Auto-Send.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Ignore when typing in non-text areas or with Shift+Enter (newline)
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // prevent default Enter behavior

            // Find the "Say It!" button by its text
            const buttons = Array.from(document.querySelectorAll('button'));
            const sayItButton = buttons.find(btn =>
                btn.textContent.trim() === 'Say It!'
            );

            if (sayItButton) {
                // If it's disabled, try to click it anyway
                sayItButton.disabled = false;
                sayItButton.click();
                console.log('Clicked the "Say It!" button.');
            } else {
                console.warn('Say It! button not found.');
            }
        }
    });
})();