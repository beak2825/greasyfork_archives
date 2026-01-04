// ==UserScript==
// @name         Bitwarden SSO Auto-Close Tab
// @namespace    https://veolia.com/
// @version      1.2
// @description  On the Bitwarden SSO connector page, automatically closes the tab when SSO is complete.
// @author       Antonin HUAUT
// @match        https://vault.bitwarden.com/sso-connector.html*
// @match        https://identity.bitwarden.com/sso/ExternalCallback
// @grant        window.close
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549819/Bitwarden%20SSO%20Auto-Close%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/549819/Bitwarden%20SSO%20Auto-Close%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let processed = false;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                tryAutoClose();
            }
        });
    });
    
    if (document.body !== null) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        setTimeout(() => closeWindow(), 1500);
    }
        
    function closeWindow() {
        processed = true;
        observer?.disconnect();
        window.close();
    }

    function tryAutoClose() {
        if (processed) return;

        const contentDiv = document.querySelector('div#content');

        if (contentDiv) {
            const contentText = contentDiv.textContent || contentDiv.innerText;

            if (contentText.includes('You may now close this tab and continue in the extension.')) {
                closeWindow();
            }
        }
    }
    
    tryAutoClose();
})();