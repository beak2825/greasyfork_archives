// ==UserScript==
// @name         FHR Card Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces card numbers with last 5 digits on Amex travel site.
// @author       You
// @match        https://www.travel.americanexpress.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558288/FHR%20Card%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/558288/FHR%20Card%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replaceCardNumbers = () => {
        const selectElement = document.getElementById('card-payment-select-input');
        if (selectElement) {
            const options = selectElement.getElementsByTagName('option');
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const value = option.value;
                if (value && /XXXX-XXXX-XXXX-\d{4}/.test(option.textContent)) {
                    option.textContent = option.textContent.replace(/XXXX-XXXX-XXXX-\d{4}/, value);
                }
            }
        }
    };

    const observer = new MutationObserver(replaceCardNumbers);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run in case the element is already on the page
    replaceCardNumbers();
})();
