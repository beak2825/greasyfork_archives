// ==UserScript==
// @name         Crunchyroll: [PageUp = Skip]
// @name:de      Crunchyroll: [Bild hoch = Skip]
// @namespace    http://tampermonkey.net/
// @version      2025-10-17
// @description  Press PageUp key at the video player to press the skip button (if available)
// @description:de  Drücke Bild hoch im Videoplayer, um zu skippen (wenn verfügbar)
// @author       L4faro
// @match        https://static.crunchyroll.com/vilos-v2/web/vilos/player.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552931/Crunchyroll%3A%20%5BPageUp%20%3D%20Skip%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/552931/Crunchyroll%3A%20%5BPageUp%20%3D%20Skip%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ////////////////////////
    // Config
    ////////////////////////

    // Keys to press for skip:
    const altKey = false;       // If Alt key as modifier is required
    const crtlKey = false;      // If Ctrl key as modifier is required
    const shiftKey = false;     // If Shift key as modifier is required
    const keyCode = 33;         // The key code for skip (33 = PageUp) - Search for JavaScript key codes in the internet for more

    ////////////////////////
    // Functions
    ////////////////////////

    // Search & press skip button
    function pressSkipButton(){
        // Search skip button via query selector
        let button = document.querySelector(`[data-testid=skipButton] [role=button]`);
        // Print message to browser console
        console.log("pressSkipButton", button ?? "No skip button found");
        // Click the Skip button, if one found. Make sure to focus the video player element
        button?.click();
    }

    // Init key event
    function registerGlobalKeyDownEvent(){
        document.onkeydown = function(evt) {
            evt = evt || window.event;

            if(crtlKey && !evt.ctrlKey)
                return;
            if(shiftKey && !evt.shiftKey)
                return;
            if(altKey && !evt.altKey)
                return;
            if (evt.keyCode != keyCode)
                return;

            pressSkipButton();
        };
    }

    ////////////////////////
    // Script
    ////////////////////////
    registerGlobalKeyDownEvent();
})();