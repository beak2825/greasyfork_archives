// ==UserScript==
// @name         Hide PressPlay Header
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隱藏 PressPlay 頁面的頂部 header
// @match        https://www.pressplay.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559004/Hide%20PressPlay%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/559004/Hide%20PressPlay%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待頁面載入完成後執行
    window.addEventListener('load', function () {
        const header = document.getElementById('pp-header');
        if (header) {
            header.style.display = 'none';   // 只隱藏，不刪除[web:8][web:11]
        }
    });
})();
