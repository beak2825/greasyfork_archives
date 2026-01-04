// ==UserScript==
// @name         Auto Unlock After CAPTCHA Solved
// @namespace    https://example.com/
// @version      1.1-clean
// @description  Automatically clicks "Unlock" after reCAPTCHA or hCaptcha is solved
// @author       KukuModZ
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556436/Auto%20Unlock%20After%20CAPTCHA%20Solved.user.js
// @updateURL https://update.greasyfork.org/scripts/556436/Auto%20Unlock%20After%20CAPTCHA%20Solved.meta.js
// ==/UserScript==

'use strict';

(function () {

    console.log("[AutoUnlock] Script loaded... waiting for CAPTCHA solve.");

    // Click Unlock button
    function clickUnlock() {
        const btn = document.querySelector(
            'button.btn.btn-primary.btn-lg.waves-effect.waves-light[type="submit"]'
        );

        if (btn) {
            console.log("[AutoUnlock] CAPTCHA solved — clicking Unlock button...");
            btn.click();
        } else {
            console.log("[AutoUnlock] Unlock button not found.");
        }
    }

    // Detect solved CAPTCHA fields (reCAPTCHA or hCaptcha)
    function captchaSolved() {
        const recaptcha = document.querySelector('#g-recaptcha-response');
        const hcaptcha = document.querySelector('textarea[name="h-captcha-response"]');

        if (
            (recaptcha && recaptcha.value.trim().length > 0) ||
            (hcaptcha && hcaptcha.value.trim().length > 0)
        ) {
            clickUnlock();
            return true;
        }

        return false;
    }

    // Observe changes to detect when CAPTCHA is solved
    const observer = new MutationObserver(() => {
        if (captchaSolved()) {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    console.log("[AutoUnlock] Watching for CAPTCHA solve event...");

})();
