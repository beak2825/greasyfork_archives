// ==UserScript==
// @name         ALTCHA Captcha Autoclick
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Automatically clicks the ALTCHA checkbox when detected it on any page
// @author       Streampunk
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAPFBMVEVHcEwdHcn///8BAcUdHdAeHtEcHMYdHc0dHcgeHtAdHc6np+Pd3fPy8vrExOyFhdoSEsg2NspqatRLS85mHgrLAAAACnRSTlMA////0bIuhlfow4nS7QAAAqJJREFUWIWlV+2WhCAIzbWmSSst3/9dN8UEC61d+TNnTBAu311Xou849JM4aOqH8Vu8xtNnnJQShJSaxs9r9oNbMHTIeMeuWHaQ8Szii9zyIOHcZo9fm0Q8oNGrxL3refkBmlezHcJAQv/ieSnN/HOhRQv5pMSoIru+cgOtTlaRGCK/4dmDCNBCDWXz5baU+Q8yoAQDBLyfPb+s2pjdmJUCsoKEmw5gP7F+NiK6z7txX1EsiwPgL9O1dUPX35DdGF/k/PMm71FIRIAOGYCZ/pphDxfcaYW8ABkMsHv87Ar8XsRMkCRGQACcFtoiP0oI3kxGjPRTlR+vhT8jVSAasNf5L0aQEJBLFb9IFuPUiRQMEyqw1PmTG7yr/dXJ838UarbX+bM08+GkPieEDqWW+VfKD9aO0YIYQ3UFXF5kltMGhPABASuFprkeYIxRuKFr6ihIh3Z4G45oDBDsLyxIMs56OQMIA0LwEENoyqaTxUNIRMD3AYJcDV9h/P0enDA/O/Emw2ofCVMX/izvMLyKKAiwQJfr7OFBRMCZSCZFKn0us9JKTsCpAevTy5V1P3slA+LGJXZ+aHyv3ACDuxslk9l5ssR/4MYhP0jichVAgXRjJoHkQ9mazOxYNkh1vtQrSUOZJJPOHkiNFBuuyF4wkEwknU8NT4Vjf0x9MT2gaTpzBYXWLqwAKdQJylOhpHEzSnJLRCyVNLao3scUTDVQAIsqX9alyycVg180CpxqjUXuqYgumgR/RJg0lmJrk8Lo9RhznCQxFV+ira3WXMO0mh1wzbW5vbcPGM0jTvuQ1T7m1QZNeR00/eF94C6NuoYddblx+y/DNr91tI77aeGw/1042leeDpcu+7+lq2tf+7rq4qleLJ5BRNvq66lx+QZ6uf7/AnzcKZPtNHiWAAAAAElFTkSuQmCC
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553661/ALTCHA%20Captcha%20Autoclick.user.js
// @updateURL https://update.greasyfork.org/scripts/553661/ALTCHA%20Captcha%20Autoclick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if ALTCHA widget exists on the page
    function hasAltchaWidget() {
        return document.querySelector('altcha-widget') !== null;
    }

    // Function to find and click the ALTCHA checkbox with a delay
    function clickAltchaCheckbox() {
        if (!hasAltchaWidget()) return; // Exit if no ALTCHA widget is found
        const checkbox = document.querySelector('input[id*="altcha_checkbox_"]');
        if (checkbox && !checkbox.checked) {
            // Add a 1-second delay before clicking
            setTimeout(() => {
                checkbox.click();
                console.log('ALTCHA checkbox clicked after 1-second delay!');
            }, 1000);
        }
    }

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            clickAltchaCheckbox();
        });
    });

    // Observer configuration
    const config = {
        childList: true,
        subtree: true
    };

    // Start observing the DOM
    observer.observe(document.body, config);

    // Check for checkbox immediately on page load
    clickAltchaCheckbox();
})();