// ==UserScript==
// @name         B2E認證系統Enter鍵綁定到送出按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  綁定Enter鍵到送出按鈕
// @author       shanlan
// @match        https://iam.cht.com.tw/auth/realms/B2E/login-actions/authenticate*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551312/B2E%E8%AA%8D%E8%AD%89%E7%B3%BB%E7%B5%B1Enter%E9%8D%B5%E7%B6%81%E5%AE%9A%E5%88%B0%E9%80%81%E5%87%BA%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/551312/B2E%E8%AA%8D%E8%AD%89%E7%B3%BB%E7%B5%B1Enter%E9%8D%B5%E7%B6%81%E5%AE%9A%E5%88%B0%E9%80%81%E5%87%BA%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const form = document.getElementById('kc-totp-login-form');
    const input = document.getElementById('totp');
    const submitBtn = document.getElementById('kc-login');

    if (input && submitBtn) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitBtn.click();
            }
        });
        input.focus();
    }
})();