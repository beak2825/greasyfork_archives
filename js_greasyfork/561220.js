// ==UserScript==
// @name         URL Debugger for Mobile
// @version      1.23
// @description  Have fun! YOTI bypass & unblur thumbnails
// @match        https://*.chaturbate.com/*
// @match        https://chaturbate.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaturbate.com
// @grant        GM_addStyle
// @license      MIT
// @namespace https://greasyfork.org/users/1555474
// @downloadURL https://update.greasyfork.org/scripts/561220/URL%20Debugger%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/561220/URL%20Debugger%20for%20Mobile.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 1. Force visibility on the most common content wrappers
    GM_addStyle(`
        /* Hide blockers */
        #age_gate_overlay, .overlay, [id*="age-gate"], [class*="age-gate"] { 
            display: none !important; 
        }

        /* Force reveal the app and all hidden parents */
        #app, #main-content, .content-wrapper, .c-app, main, section {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* Ensure images are never blurred by CSS */
        img {
            filter: none !important;
            -webkit-filter: none !important;
        }

        /* Prevent scroll locking */
        body, html {
            overflow: auto !important;
            display: block !important;
        }
    `);

    setInterval(() => {
        // 2. Unblur Images logic (The part we know works)
        document.querySelectorAll('img[src]').forEach(el => {
            if (el.dataset.processed === "true") return;

            let originalSrc = el.src;
            let newSrc = originalSrc;

            if (originalSrc.includes('/ribw/')) {
                newSrc = originalSrc.replace('/ribw/', '/riw/');
            } else if (originalSrc.includes('/rib/')) {
                newSrc = originalSrc.replace('/rib/', '/ri/');
            }

            if (newSrc !== originalSrc) {
                el.src = newSrc;
                el.dataset.processed = "true";
            }
        });

        // 3. Force clean the body classes that cause grey-outs/locking
        if (document.body) {
            document.body.className = ""; // Wipes all "noscroll" or "modal-open" classes at once
            document.body.style.background = "none";
        }

    }, 1000);

})();
