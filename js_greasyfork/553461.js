// ==UserScript==
// @name         Auto Refresh on IconCaptcha Error
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Refresh page if "Captcha Error" modal appears
// @author       Antibanotrewo
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553461/Auto%20Refresh%20on%20IconCaptcha%20Error.user.js
// @updateURL https://update.greasyfork.org/scripts/553461/Auto%20Refresh%20on%20IconCaptcha%20Error.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkAndReload = () => {
        const el = document.querySelector('.iconcaptcha-modal__body-title');
        if (el && el.textContent.trim() === 'Captcha Error') {
            location.reload();
        }
    };

    // Check once right away
    checkAndReload();

    // Observe for dynamically added elements
    const observer = new MutationObserver(checkAndReload);
    observer.observe(document.body, { childList: true, subtree: true });
})();
