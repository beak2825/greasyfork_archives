// ==UserScript==
// @name         隐藏广告
// @namespace    http://tampermonkey.net/
// @description  隐藏jsoneditoronline的广告
// @version      2025-09-11
// @match        https://jsoneditoronline.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsoneditoronline.org
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549134/%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/549134/%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
        // 注入自定义 CSS
    GM_addStyle(`
        .ad-panel {
            display: none !important;
        }
    `);
})();