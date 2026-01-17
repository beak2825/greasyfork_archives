// ==UserScript==
// @name         Always show & click "Continue" + "Get Link" (Fixed)
// @match        https://vidyarays.com/*
// @run-at       document-end
// @locale       en
// @description  Automatically forces visibility of hidden buttons and clicks Continue/Get Link on specific sites.
// @version      1.4
// @license      unlicense
// @namespace https://greasyfork.org/users/1560892
// @downloadURL https://update.greasyfork.org/scripts/562843/Always%20show%20%20click%20%22Continue%22%20%2B%20%22Get%20Link%22%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562843/Always%20show%20%20click%20%22Continue%22%20%2B%20%22Get%20Link%22%20%28Fixed%29.meta.js
// ==/UserScript==

(function () {
    // 0. FIX UBLOCK FILTERS (Use CSS to hide instead of remove to prevent JS errors)
    // We inject a style tag so the elements exist (keeping site scripts happy) but are invisible to you.
    const style = document.createElement('style');
    style.innerHTML = `
        .adb-overlay, center > p, #kt-scroll-up,
        .site-header-row-layout-standard.site-header-focus-item.site-header-row-container.site-main-header-wrap > .site-header-row-container-inner,
        .content-area,
        .ft-ro-lstyle-plain.ft-ro-m-dir-default.ft-ro-t-dir-default.ft-ro-collapse-normal.ft-ro-dir-row.site-footer-row-mobile-column-layout-row.site-footer-row-tablet-column-layout-default.site-footer-row-column-layout-row.site-footer-row-columns-1.site-footer-row.site-bottom-footer-inner-wrap
        { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }
    `;
    document.head.appendChild(style);

    // 1. Force visibility immediately (Original Code)
    const elements = document.querySelectorAll("button, a, input[type='button'], input[type='submit'], #continue-show, #tp-btn, #getlink, .get-link");
    elements.forEach(el => {
        el.style.display = "block";
        el.style.visibility = "visible";
        el.style.opacity = "1";
    });

    // 2. Execute Action after 1 second
    setTimeout(() => {
        // PRIORITY 1: The "Continue" Page (Bypass Button)
        // We look for the form ID 'sgu4tech' directly. Submitting this bypasses the
        // Cloudflare check and the 2-second timer that was failing before.
        const continueForm = document.getElementById("sgu4tech");
        if (continueForm) {
            console.log("Form #sgu4tech found. Submitting directly to bypass timer/checks.");
            continueForm.submit();
            return; // Stop here, we don't need to click buttons if we submitted the form
        }

        // PRIORITY 2: The "Get Link" Page (Click Button)
        // If the form doesn't exist, we assume we are on the final page or a different step.
        elements.forEach(el => {
            const text = el.innerText ? el.innerText.toLowerCase() : "";

            const isTarget = el.id === "continue-show" ||
                             el.id === "tp-btn" ||
                             el.id === "getlink" ||
                             (el.classList && el.classList.contains("get-link")) ||
                             text.includes("continue") ||
                             text.includes("get link") ||
                             text.includes("verify") ||
                             text.includes("go to url");

            if (isTarget && (el.offsetWidth > 0 || el.offsetHeight > 0)) {
                if (!el.hasAttribute('disabled')) {
                    el.click();
                    console.log("Automated click triggered on:", el);
                }
            }
        });
    }, 1000); // 1000ms = 1 seconds delay
})();