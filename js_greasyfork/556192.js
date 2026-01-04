// ==UserScript==
// @name         PM2 App - Dialog Resize
// @namespace    http://tampermonkey.net/
// @version      2025-09-18
// @description  Thêm CSS để dialog trong app.pm2.io rộng 90%
// @author       You
// @match        https://app.pm2.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pm2.io
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/556192/PM2%20App%20-%20Dialog%20Resize.user.js
// @updateURL https://update.greasyfork.org/scripts/556192/PM2%20App%20-%20Dialog%20Resize.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Chèn CSS vào trang
    GM_addStyle(`
        .v-dialog.v-dialog--active {
            max-width: 90% !important;
        }
    `);
})();