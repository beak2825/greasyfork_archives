// ==UserScript==
// @name         Enable Emitir Button
// @namespace    http://violentmonkey.net/
// @version      1.0
// @description  Removes the disabled attribute from the Emitir button
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563639/Enable%20Emitir%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/563639/Enable%20Emitir%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function enableButton() {
        const button = document.querySelector('button.btn.btn-primary.btn-success');
        if (button && button.disabled) {
            button.disabled = false;
            button.removeAttribute('disabled');
        }
    }

    enableButton();

    const observer = new MutationObserver(enableButton);
    observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled']
    });
})();
