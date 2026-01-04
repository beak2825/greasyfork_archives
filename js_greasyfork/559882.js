// ==UserScript==
// @name         Windy.com Remove Premium Grayscale
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove Windy.com Premium Calendar gray scale
// @author       You
// @match        https://www.windy.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559882/Windycom%20Remove%20Premium%20Grayscale.user.js
// @updateURL https://update.greasyfork.org/scripts/559882/Windycom%20Remove%20Premium%20Grayscale.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 GM_addStyle 注入 CSS 並強制覆蓋原有設定
    GM_addStyle(`
        .premium-calendar #map-container #leaflet-map {
            filter: none !important;
            animation: none !important;
        }
    `);
})();