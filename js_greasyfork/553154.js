// ==UserScript==
// @name         Bili+
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bili without AD Banner
// @author       the3ash
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553154/Bili%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/553154/Bili%2B.meta.js
// ==/UserScript==

(function () {
  GM_addStyle(`
.adblock-tips{
   display: none !important;
}

.activity-m-v1.act-now {
   display: none !important;
}

.slide-gg {
   display: none !important;
}

    `);
})();
