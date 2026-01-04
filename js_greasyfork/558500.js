// ==UserScript==
// @name         Cuttlinks Auto Submit
// @namespace    AutoBypass
// @version      1.0
// @description  Auto click Continue on Cuttlinks
// @author       NickUpdates-Telegram
// @match        https://cuttlinks.com/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/558500/Cuttlinks%20Auto%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/558500/Cuttlinks%20Auto%20Submit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function submitForm() {
        const btn = document.querySelector("#submit-button");
        if (btn) {
            btn.click();
        }
    }
    submitForm();
    const observer = new MutationObserver(() => submitForm());
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
