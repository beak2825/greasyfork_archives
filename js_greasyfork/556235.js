// ==UserScript==
// @name         CoinArns
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       KukuModZ
// @license      MIT
// @description  Refresh CoinArns faucet page every 1.5 minutes
// @match        https://coinarns.com/faucet*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/556235/CoinArns.user.js
// @updateURL https://update.greasyfork.org/scripts/556235/CoinArns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshTime = 90 * 1000; // 1.5 minutes

    console.log("CoinArns auto-refresh active — reload in 90 seconds...");

    setTimeout(() => {
        window.location.reload();
    }, refreshTime);

})();
