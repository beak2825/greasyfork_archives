// ==UserScript==
// @name         Remove AI Mode button from google
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  Remove this ugly button from google
// @author       Ximer
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555344/Remove%20AI%20Mode%20button%20from%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/555344/Remove%20AI%20Mode%20button%20from%20google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // var AiModeButton = document.getElementsByClassName("XVMlrc C6AK7c");
    // AiModeButton.parentNode.removeChild(AiModeButton);

    const style = document.createElement("style");
    style.textContent = ".XVMlrc.C6AK7c { display: none !important; }";
    document.head.appendChild(style);

})();