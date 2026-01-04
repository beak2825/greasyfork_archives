// ==UserScript==
// @name         MixFaucet Auto Redirect
// @namespace    https://mixfaucet.com/
// @version      1.0-clean
// @description  Wait 3 seconds on dashboard, then go to faucet page
// @author       KukuModZ
// @match        https://mixfaucet.com/dashboard*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556437/MixFaucet%20Auto%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/556437/MixFaucet%20Auto%20Redirect.meta.js
// ==/UserScript==

'use strict';

(function () {

    console.log("[MixFaucet AutoRedirect] Script loaded — waiting 3 seconds...");

    // After 3 seconds, redirect user to faucet page
    setTimeout(() => {
        console.log("[MixFaucet AutoRedirect] Redirecting to /faucet ...");
        window.location.href = "https://mixfaucet.com/faucet";
    }, 3000);

})();
