// ==UserScript==
// @name         Sportlogiq: Default Shifts Off
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Вимикає кнопку "Shifts" після завантаження сторінки.
// @author       Volodymyr Kerdiak
// @match        https://app.sportlogiq.com/EventorApp.php*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554191/Sportlogiq%3A%20Default%20Shifts%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/554191/Sportlogiq%3A%20Default%20Shifts%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Sportlogiq Script v1.5 [Persistent Mode] Initialized.');

    const buttonSelector = '#shifts-button.active';
    const checkInterval = 500;
    const timeoutDuration = 15000;

    let clickAttempted = false;

    function simulateRealisticClick(element) {
        if (!element) return;

        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });

        element.dispatchEvent(mouseDownEvent);
        element.dispatchEvent(mouseUpEvent);
        element.click();
    }

    const intervalId = setInterval(() => {
        const shiftsButton = document.querySelector(buttonSelector);

        if (shiftsButton) {
            if (!clickAttempted) {
                console.log('Sportlogiq Script: Persistent check found an active button. Attempting to deactivate.');
                clickAttempted = true;
            }
            simulateRealisticClick(shiftsButton);
        } else {
            if (clickAttempted) {
                console.log('Sportlogiq Script: Button is now inactive.');
            }
            clickAttempted = false;
        }
    }, checkInterval);

    setTimeout(() => {
        clearInterval(intervalId);
        console.log(`Sportlogiq Script: Persistent check stopped after ${timeoutDuration / 1000} seconds.`);
    }, timeoutDuration);
})();