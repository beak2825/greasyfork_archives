// ==UserScript==
// @name         kogama remove paste protection for friends/us server!!!
// @namespace    http://tampermonkey.net/
// @version      2055
// @description  Fix the paste restriction bug in Kogama without checking link type, now for the us/friends server
// @author       XPander
// @match        https://friends.kogama.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kogama.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/550376/kogama%20remove%20paste%20protection%20for%20friendsus%20server%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/550376/kogama%20remove%20paste%20protection%20for%20friendsus%20server%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle pasting
    function allowPaste(event) {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('Text');

        // Prevent the default pasting behavior and manually insert the text
        event.preventDefault();
        document.activeElement.value += pastedText;
    }

    // Add event listener for paste event
    document.addEventListener('paste', allowPaste, false);

    console.log('Kogama Paste Fix Active (No Link Check)');
})();


// thank you for using my userscript!

                         // -xpander (Vu652)!