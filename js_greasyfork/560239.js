// ==UserScript==
// @name         Twerking Bogie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a twerking Bogie GIF to the lower-left corner on Torn forums page
// @author       2115907
// @match        https://www.torn.com/forums.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560239/Twerking%20Bogie.user.js
// @updateURL https://update.greasyfork.org/scripts/560239/Twerking%20Bogie.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the image element
    const bogieGif = document.createElement('img');
    bogieGif.src = 'https://i.ibb.co/wNLQkHXx/bogietwerkgif.gif';
    bogieGif.style.position = 'fixed';
    bogieGif.style.bottom = '10px';
    bogieGif.style.left = '10px';
    bogieGif.style.width = '120px'; // adjust size as needed
    bogieGif.style.height = 'auto';
    bogieGif.style.zIndex = '9999';
    bogieGif.style.pointerEvents = 'none'; // makes it non-interactive

    // Add the GIF to the page
    document.body.appendChild(bogieGif);
})();
