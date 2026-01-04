// ==UserScript==
// @name         Aliexpress Skip Bundle Deals
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  Redirects AliExpress bundle deals page to their corresponding item pages
// @author       Andrew
// @match        https://www.aliexpress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555309/Aliexpress%20Skip%20Bundle%20Deals.user.js
// @updateURL https://update.greasyfork.org/scripts/555309/Aliexpress%20Skip%20Bundle%20Deals.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url = new URL(document.location);
    if (!url.pathname.startsWith('/ssr/') && !url.pathname.startsWith('/gcp/')) {
        return;
    }
    const productIds = new URL(url).searchParams.get('productIds').split(':')[0];
    if (productIds) {
        const new_url = `https://www.aliexpress.com/item/${productIds}.html`;
        location.replace(new_url);
    }
})();