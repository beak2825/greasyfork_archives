// ==UserScript==
// @name         Hide StackOverflow Cookie
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the OneTrust cookie banner on StackOverflow/StackExchange sites
// @author       you
// @match        https://stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @match        https://superuser.com/*
// @match        https://serverfault.com/*
// @match        https://askubuntu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549064/Hide%20StackOverflow%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/549064/Hide%20StackOverflow%20Cookie.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideOneTrust() {
        const banner = document.getElementById("onetrust-consent-sdk");
        if (banner) {
            banner.style.display = "none";
            console.log("StackOverflow cookie banner hidden");
        }
    }

    // Run once after DOM is loaded
    document.addEventListener("DOMContentLoaded", hideOneTrust);

    // Also run periodically in case banner is injected later
    const observer = new MutationObserver(hideOneTrust);
    observer.observe(document.body, { childList: true, subtree: true });
})();
