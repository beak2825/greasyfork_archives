// ==UserScript==
// @name         Bitwarden SSO Autofill Flexcity
// @namespace    https://veolia.com/
// @version      1.1
// @description  On the Bitwarden SSO page, it fills the identifier with 'Flexcity' and submits.
// @author       Antonin HUAUT
// @match        https://vault.bitwarden.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549818/Bitwarden%20SSO%20Autofill%20Flexcity.user.js
// @updateURL https://update.greasyfork.org/scripts/549818/Bitwarden%20SSO%20Autofill%20Flexcity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ssoIdentifier = "Flexcity";
    let processed = false;
    let currentUrl = window.location.href;

    const isSSOLoginPage = () => window.location.hash.includes('/sso'); // Can't used @match on chrome with hash routing

    function tryAutoFill() {
        if (processed || !isSSOLoginPage()) return;

        const identifierInput = document.querySelector('input[formcontrolname="identifier"]');
        const submitButton = document.querySelector('button[type="submit"]');

        if (identifierInput && submitButton) {
            processed = true;

            identifierInput.value = ssoIdentifier;
            identifierInput.dispatchEvent(new Event('input', { bubbles: true }));
            identifierInput.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(() => {
                if (!submitButton.disabled) {
                    observer.disconnect();
                    submitButton.click();
                } else {
                    processed = false;
                }
            }, 100);
        }
    }

    tryAutoFill();

    const observer = new MutationObserver(() => tryAutoFill());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();