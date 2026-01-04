// ==UserScript==
// @name         X+
// @namespace    http://tampermonkey.net/
// @version      1.0
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
.css-175oi2r.r-aqfbo4.r-1pi2tsx.r-1xcajam.r-ipm5af{
   left:0 !important;
}

.r-ero68b{
  min-width: 108px !important;
}
    `);
})();
