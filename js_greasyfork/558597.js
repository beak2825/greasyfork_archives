// ==UserScript==
// @name         Daily Cookie
// @namespace    cnw_tech
// @version      2025-12-12
// @description  Daily Cookie Clicker
// @author       ymj
// @match        https://teamdev-square.com
// @license      All rights reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558597/Daily%20Cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/558597/Daily%20Cookie.meta.js
// ==/UserScript==

(function() {
    setTimeout(() => {
        const targetButton = document.querySelector('.css-v4v9h3');
        if (targetButton) {
            targetButton.click();

            setTimeout(() => {
                const fortuneCookieButton = document.querySelector('.css-2ca1l3');
                if (fortuneCookieButton) {
                    fortuneCookieButton.click();
                }
            }, 50);
        }
    }, 2000);
})();
