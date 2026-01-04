// ==UserScript==
// @name         AlwaysLoadTranscript
// @namespace    http://theguy920.dev/
// @version      2.1
// @description  Re-enables sign in capabilities for courses.flvc.org
// @author       TheGuy920
// @match        https://courses.flvc.org/Account/StudentLogin*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flvc.org
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/559171/AlwaysLoadTranscript.user.js
// @updateURL https://update.greasyfork.org/scripts/559171/AlwaysLoadTranscript.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetId = 'student-login-button';

    function ensureVisible(el) {
        if (el.style.display === 'none') {
            el.style.removeProperty('display');
        }
    }

    // Observe style changes on the element
    function observeStyle(el) {
        const styleObserver = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'attributes' && m.attributeName === 'style') {
                    ensureVisible(el);
                }
            }
        });

        styleObserver.observe(el, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    // Observe DOM until element exists
    const domObserver = new MutationObserver(() => {
        const el = document.getElementById(targetId);
        if (!el) return;

        ensureVisible(el);
        observeStyle(el);
        domObserver.disconnect();
    });

    domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
