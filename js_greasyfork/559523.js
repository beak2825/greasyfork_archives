// ==UserScript==
// @name         Auto Spin Doge House
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the SPIN THE WHEEL button on Doge House when available.
// @author       Rubystance
// @license      MIT
// @match        https://doge-house.site/wheel/wheel.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559523/Auto%20Spin%20Doge%20House.user.js
// @updateURL https://update.greasyfork.org/scripts/559523/Auto%20Spin%20Doge%20House.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickSpinButton() {
        const button = document.getElementById('spinButton');
        if (button && !button.disabled) {
            console.log('Clicking the SPIN THE WHEEL button...');
            button.click();
        }
    }

    const targetNode = document.body;
    const config = { childList: true, subtree: true, attributes: true };

    const callback = function(mutationsList, observer) {
        clickSpinButton();
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    setInterval(clickSpinButton, 2000);
})();
