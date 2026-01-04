// ==UserScript==
// @name         popcat
// @namespace    http://tampermonkey.net/
// @version      1.67
// @description  yessir
// @author       7X12
// @match        *://*popcat.click*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548716/popcat.user.js
// @updateURL https://update.greasyfork.org/scripts/548716/popcat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });

    function spamKeys() {
        let count = 0;
        let interval = setInterval(() => {
            document.dispatchEvent(event);
            count++;
            if (count >= 800) {
                clearInterval(interval);
            }
        }, 37.5); // ~37.5 ms between clicks (800 in 30s)
    }

    // Run every 30 seconds
    setInterval(spamKeys, 30000);
})();