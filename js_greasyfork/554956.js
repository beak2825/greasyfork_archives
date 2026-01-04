// ==UserScript==
// @name         91去除广告
// @namespace    http://tampermonkey.net/
// @version      2025-11-09
// @description  去除91上的广告
// @author       gzcoder
// @match        https://91porn.com/*
// @match        *.91splt.app/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91porn.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/554956/91%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/554956/91%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
     GM_addStyle("#cont3{display:none !important}")
     GM_addStyle("iframe{display:none !important}")
     GM_addStyle(".ad_img{display:none !important}")
})();