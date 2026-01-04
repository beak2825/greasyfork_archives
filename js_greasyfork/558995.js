// ==UserScript==
// @name         Neopets: Autofill Stock Market Shares
// @version      1.0
// @namespace    https://github.com/NicoSlothEmoji
// @description  Automatically sets number of shares to 1,000 on stock market buy page.
// @author       NicoSlothEmoji
// @match        *://www.neopets.com/stockmarket.phtml?type=buy*
// @match        *://neopets.com/stockmarket.phtml?type=buy*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558995/Neopets%3A%20Autofill%20Stock%20Market%20Shares.user.js
// @updateURL https://update.greasyfork.org/scripts/558995/Neopets%3A%20Autofill%20Stock%20Market%20Shares.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        $('[name=amount_shares]').val('1000');
    });
})();