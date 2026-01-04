// ==UserScript==
// @name         McDVoice Auto Next
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the Next button on McDVoice survey pages
// @author       louietyj
// @match        https://www.mcdvoice.com/Survey.aspx*
// @match        https://mcdvoice.com/Survey.aspx*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554469/McDVoice%20Auto%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/554469/McDVoice%20Auto%20Next.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickNextButton() {
        const nextButton = document.querySelector('input[type="submit"]#NextButton');
        if (nextButton) {
            nextButton.click();
        }
    }

    // Wait for the page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', clickNextButton);
    } else {
        clickNextButton();
    }

    // Also check periodically in case the button appears after some animations/delays
    const observer = new MutationObserver(() => {
        const nextButton = document.querySelector('input[type="submit"]#NextButton');
        if (nextButton && nextButton.offsetParent !== null) {
            observer.disconnect();
            clickNextButton();
        }
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
