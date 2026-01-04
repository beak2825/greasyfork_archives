// ==UserScript==
// @name         WME TB Bypass
// @namespace    https://greasyfork.org/de/users/863740-horst-wittlich
// @version      2025-06-14
// @description  WME Toolbox Bypass
// @author       Hiwi234
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552374/WME%20TB%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/552374/WME%20TB%20Bypass.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    //while not fully loaded try setting the rank
    while (!W?.loginManager?.user) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    W.loginManager.user.attributes.rank = 5
})();
