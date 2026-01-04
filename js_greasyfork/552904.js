// ==UserScript==
// @name         SAP Help Disclaimer Auto-Agree - No Blank Tab
// @namespace    sap-auto-agree
// @version      1.3
// @description  Auto-accepts SAP Help disclaimer, double-decodes link, prevents about:blank tab
// @match        https://help.sap.com/docs/link-disclaimer*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/552904/SAP%20Help%20Disclaimer%20Auto-Agree%20-%20No%20Blank%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/552904/SAP%20Help%20Disclaimer%20Auto-Agree%20-%20No%20Blank%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Prevent SAP script from opening a new window
    const originalOpen = window.open;
    window.open = function(url) {
        // redirect inside same tab instead
        if (url && url.startsWith('http')) {
            window.location.replace(url);
        }
        return null;
    };

    // 2. Decode the target URL (handle double encoding)
    const params = new URLSearchParams(window.location.search);
    let target = params.get('site');
    if (target) {
        try {
            target = decodeURIComponent(decodeURIComponent(target));
        } catch {
            target = decodeURIComponent(target);
        }
    }

    // 3. Wait for DOM and click button
    window.addEventListener('DOMContentLoaded', function() {
        const selectors = [
            'button[data-testid="agree-button"]',
            'button#agreeButton',
            'input[value="Agree and Proceed"]',
            'a[href*="site="]'
        ];

        function act() {
            for (const s of selectors) {
                const btn = document.querySelector(s);
                if (btn) {
                    btn.click();
                    console.log('SAP disclaimer accepted.');
                    setTimeout(() => {
                        if (target) window.location.replace(target);
                    }, 1000);
                    return;
                }
            }
        }

        act();
        setTimeout(act, 1500);
    });
})();
