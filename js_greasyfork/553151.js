// ==UserScript==
// @name         X+
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Fix nav with Minimal Twitter
// @author       the3ash
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553151/X%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/553151/X%2B.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`
header[role="banner"],
div:has(> div > div > div > nav[aria-label="主要"]),
div:has(> div > div > div > nav[aria-label="Primary"]) {
   left: 0 !important;
}

a[href="/i/jf/creators/studio"] {
    display: none !important;
}
    `);
})();
